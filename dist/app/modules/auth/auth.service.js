"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../errors/AppError");
const sendEmail_1 = require("../../utils/sendEmail");
const uploadImage_1 = require("../../utils/uploadImage");
const auth_model_1 = require("./auth.model");
const generateToken = (payload, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expiresIn,
    });
};
const loginAdmin = async (payload) => {
    const user = await auth_model_1.User.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new AppError_1.AppError(404, "Invalid credentials. User does not exist.");
    }
    if (user.status === "BLOCKED") {
        throw new AppError_1.AppError(403, "This admin account is suspended.");
    }
    const isPasswordMatched = await auth_model_1.User.isPasswordMatched(payload.password || "", user.password || "");
    if (!isPasswordMatched) {
        throw new AppError_1.AppError(401, "Invalid credentials. Password is incorrect.");
    }
    const jwtPayload = {
        id: user._id?.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = generateToken(jwtPayload, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    const refreshToken = generateToken(jwtPayload, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
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
const changePassword = async (userId, passwordData) => {
    const user = await auth_model_1.User.findById(userId).select("+password");
    if (!user) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    const isPasswordMatched = await auth_model_1.User.isPasswordMatched(passwordData.oldPassword, user.password || "");
    if (!isPasswordMatched) {
        throw new AppError_1.AppError(400, "Current password does not match.");
    }
    user.password = passwordData.newPassword;
    user.passwordChangedAt = new Date();
    await user.save();
    return { message: "Password changed successfully" };
};
const forgotPassword = async (payload) => {
    const user = await auth_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new AppError_1.AppError(404, "No admin account registered with this email.");
    }
    // Generate random reset token
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    // Hash token and set to passwordResetToken field
    user.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    // Set expiry to 15 minutes
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    // Create reset link
    const resetUrl = `${config_1.default.admin_url}/reset-password?token=${resetToken}`;
    // Send email
    try {
        const html = (0, sendEmail_1.createPasswordResetEmailTemplate)(resetUrl, user.name);
        await (0, sendEmail_1.sendEmail)({
            to: user.email,
            subject: "Password Reset Request - TMYAZNA Admin Dashboard",
            html,
        });
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        throw new AppError_1.AppError(500, "There was an error sending the reset email. Please try again later.");
    }
    return {
        message: "Password reset link sent to your email address.",
        resetToken: config_1.default.env === "development" ? resetToken : undefined,
    };
};
const resetPassword = async (payload) => {
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(payload.token)
        .digest("hex");
    const user = await auth_model_1.User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        throw new AppError_1.AppError(400, "Token is invalid or has expired.");
    }
    user.password = payload.newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = new Date();
    await user.save();
    return { message: "Password has been successfully reset. You can now login with your new password." };
};
const getMe = async (userId) => {
    const user = await auth_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    return user;
};
const updateMe = async (userId, payload, file) => {
    const user = await auth_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    // Handle avatar upload to Cloudinary if file provided
    if (file) {
        if (user.avatar?.public_id) {
            await (0, uploadImage_1.deleteFromCloudinary)(user.avatar.public_id);
        }
        const uploadResult = await (0, uploadImage_1.uploadToCloudinary)(file.buffer, "tmyazna/avatars");
        payload.avatar = {
            url: uploadResult.url,
            public_id: uploadResult.public_id,
        };
    }
    const updatedUser = await auth_model_1.User.findByIdAndUpdate(userId, { $set: payload }, { new: true, runValidators: true });
    return updatedUser;
};
const refreshToken = async (token) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new AppError_1.AppError(401, "Refresh token is invalid or expired.");
    }
    const { email, iat } = decoded;
    const user = await auth_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError(404, "User does not exist.");
    }
    if (user.status === "BLOCKED") {
        throw new AppError_1.AppError(403, "User is blocked.");
    }
    if (user.passwordChangedAt &&
        auth_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new AppError_1.AppError(401, "Password was changed recently. Please log in again.");
    }
    const jwtPayload = {
        id: user._id?.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = generateToken(jwtPayload, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    return {
        accessToken,
    };
};
exports.AuthService = {
    loginAdmin,
    changePassword,
    forgotPassword,
    resetPassword,
    getMe,
    updateMe,
    refreshToken,
};
