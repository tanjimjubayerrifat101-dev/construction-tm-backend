import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { AppError } from "../errors/AppError";
import { IUserRole } from "../modules/auth/auth.interface";
import { User } from "../modules/auth/auth.model";
import { catchAsync } from "../utils/catchAsync";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: string;
        email: string;
        role: IUserRole;
      };
    }
  }
}

export const auth = (...requiredRoles: IUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // Bearer token check
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      throw new AppError(401, "You are not authorized! Token is missing.");
    }

    // Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt.access_secret
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(401, "Unauthorized! Invalid or expired token.");
    }

    const { email, role, iat, id } = decoded;

    // Check if user still exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, "User belonging to this token no longer exists.");
    }

    // Check if user is blocked
    if (user.status === "BLOCKED") {
      throw new AppError(403, "This admin account has been suspended.");
    }

    // Check if password changed after token was issued
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(
        401,
        "You recently changed password! Please login again."
      );
    }

    // Role checking
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        403,
        "Forbidden! You do not have permission to access this resource."
      );
    }

    req.user = {
      ...decoded,
      id: id || user._id?.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  });
};
