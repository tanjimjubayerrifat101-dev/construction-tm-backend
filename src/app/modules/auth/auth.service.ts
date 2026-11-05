import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { AppError } from "../../errors/AppError";
import {
  createPasswordResetEmailTemplate,
  sendEmail,
} from "../../utils/sendEmail";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/uploadImage";
import {
  IChangePassword,
  IForgotPassword,
  ILoginUser,
  IResetPassword,
  IUpdateAdminProfile,
} from "./auth.interface";
import { User } from "./auth.model";

const generateToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as any,
  });
};

const loginAdmin = async (payload: ILoginUser) => {
  const inputEmail = (payload.email || "").trim().toLowerCase();
  const envEmail = (config.super_admin.email || "").trim().toLowerCase();
  const isSuperAdminEnv = Boolean(envEmail) && inputEmail === envEmail;

  let user = await User.isUserExistsByEmail(inputEmail);

  // If Super Admin doesn't exist in DB yet, auto-create when credentials match .env
  if (!user && isSuperAdminEnv) {
    if (payload.password === config.super_admin.password) {
      await User.create({
        name: config.super_admin.name || "Admin",
        email: envEmail,
        password: config.super_admin.password,
        role: "ADMIN",
        status: "ACTIVE",
      });
      user = await User.isUserExistsByEmail(inputEmail);
    } else {
      throw new AppError(401, "Invalid credentials. Password is incorrect.");
    }
  }

  if (!user) {
    throw new AppError(404, "Invalid credentials. User does not exist.");
  }

  if (user.status === "BLOCKED") {
    throw new AppError(403, "This admin account is suspended.");
  }

  // Check password: match against .env super admin password directly OR via bcrypt compare
  const isDirectEnvMatch =
    isSuperAdminEnv && payload.password === config.super_admin.password;
  const isHashMatch = await User.isPasswordMatched(
    payload.password || "",
    user.password || ""
  );

  if (!isDirectEnvMatch && !isHashMatch) {
    throw new AppError(401, "Invalid credentials. Password is incorrect.");
  }

  // If logged in via .env and DB hash differs (e.g. password changed in .env), sync DB password
  if (isDirectEnvMatch && !isHashMatch && user._id) {
    const userDoc = await User.findById(user._id).select("+password");
    if (userDoc) {
      userDoc.password = config.super_admin.password;
      await userDoc.save();
    }
  }

  const jwtPayload = {
    id: user._id?.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt.access_secret,
    config.jwt.access_expires_in
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
    },
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userId: string,
  passwordData: IChangePassword
) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const isPasswordMatched = await User.isPasswordMatched(
    passwordData.oldPassword,
    user.password || ""
  );

  if (!isPasswordMatched) {
    throw new AppError(400, "Current password does not match.");
  }

  user.password = passwordData.newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  return { message: "Password changed successfully" };
};

const forgotPassword = async (payload: IForgotPassword) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(404, "No admin account registered with this email.");
  }

  // Generate random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token and set to passwordResetToken field
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiry to 15 minutes
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  // Create reset link
  const resetUrl = `${config.admin_url}/reset-password?token=${resetToken}`;

  // Send email
  try {
    const html = createPasswordResetEmailTemplate(resetUrl, user.name);
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request - TMYAZNA Admin Dashboard",
      html,
    });
  } catch (error: any) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw new AppError(500, "There was an error sending the reset email. Please try again later.");
  }

  return {
    message: "Password reset link sent to your email address.",
    resetToken: config.env === "development" ? resetToken : undefined,
  };
};

const resetPassword = async (payload: IResetPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(payload.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(400, "Token is invalid or has expired.");
  }

  user.password = payload.newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  return { message: "Password has been successfully reset. You can now login with your new password." };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found.");
  }
  return user;
};

const updateMe = async (
  userId: string,
  payload: IUpdateAdminProfile,
  file?: Express.Multer.File
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found.");
  }

  // Handle avatar upload to Cloudinary if file provided
  if (file) {
    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }
    const uploadResult = await uploadToCloudinary(file.buffer, "tmyazna/avatars");
    payload.avatar = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return updatedUser;
};

const refreshToken = async (token: string) => {
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, config.jwt.refresh_secret) as JwtPayload;
  } catch (err) {
    throw new AppError(401, "Refresh token is invalid or expired.");
  }

  const { email, iat } = decoded;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User does not exist.");
  }

  if (user.status === "BLOCKED") {
    throw new AppError(403, "User is blocked.");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number
    )
  ) {
    throw new AppError(401, "Password was changed recently. Please log in again.");
  }

  const jwtPayload = {
    id: user._id?.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt.access_secret,
    config.jwt.access_expires_in
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  loginAdmin,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  refreshToken,
};
