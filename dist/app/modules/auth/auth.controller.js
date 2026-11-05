"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const loginAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.loginAdmin(req.body);
    const { refreshToken, accessToken, user } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.env === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin logged in successfully",
        data: {
            user,
            accessToken,
        },
    });
});
const changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.id;
    const result = await auth_service_1.AuthService.changePassword(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
const forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.forgotPassword(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result.resetToken ? { resetToken: result.resetToken } : null,
    });
});
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.resetPassword(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.id;
    const result = await auth_service_1.AuthService.getMe(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin profile retrieved successfully",
        data: result,
    });
});
const updateMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.id;
    const result = await auth_service_1.AuthService.updateMe(userId, req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin profile updated successfully",
        data: result,
    });
});
const refreshToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const result = await auth_service_1.AuthService.refreshToken(token);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token refreshed successfully",
        data: result,
    });
});
exports.AuthController = {
    loginAdmin,
    changePassword,
    forgotPassword,
    resetPassword,
    getMe,
    updateMe,
    refreshToken,
};
