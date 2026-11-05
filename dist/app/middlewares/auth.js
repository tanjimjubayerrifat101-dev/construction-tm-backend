"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = require("../errors/AppError");
const auth_model_1 = require("../modules/auth/auth.model");
const catchAsync_1 = require("../utils/catchAsync");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.catchAsync)(async (req, res, next) => {
        let token = req.headers.authorization;
        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        // Bearer token check
        if (token && token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }
        if (!token) {
            throw new AppError_1.AppError(401, "You are not authorized! Token is missing.");
        }
        // Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.access_secret);
        }
        catch (err) {
            throw new AppError_1.AppError(401, "Unauthorized! Invalid or expired token.");
        }
        const { email, role, iat, id } = decoded;
        // Check if user still exists
        const user = await auth_model_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.AppError(404, "User belonging to this token no longer exists.");
        }
        // Check if user is blocked
        if (user.status === "BLOCKED") {
            throw new AppError_1.AppError(403, "This admin account has been suspended.");
        }
        // Check if password changed after token was issued
        if (user.passwordChangedAt &&
            auth_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
            throw new AppError_1.AppError(401, "You recently changed password! Please login again.");
        }
        // Role checking
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError_1.AppError(403, "Forbidden! You do not have permission to access this resource.");
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
exports.auth = auth;
