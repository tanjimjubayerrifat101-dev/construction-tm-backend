"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const media_service_1 = require("./media.service");
const getRequestedLanguage = (req) => {
    if (req.query.lang) {
        return req.query.lang;
    }
    const acceptLang = req.headers["accept-language"];
    if (acceptLang && acceptLang.toLowerCase().includes("ar")) {
        return "ar";
    }
    return undefined;
};
const createMediaPost = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await media_service_1.MediaService.createMediaPost(req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Media article created successfully",
        data: result,
    });
});
const getAllMediaPosts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lang = getRequestedLanguage(req);
    const result = await media_service_1.MediaService.getAllMediaPosts(req.query, lang);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media articles retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getMediaPostBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lang = getRequestedLanguage(req);
    const result = await media_service_1.MediaService.getMediaPostBySlug(req.params.slug, lang);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media article details retrieved successfully",
        data: result,
    });
});
const getMediaPostById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await media_service_1.MediaService.getMediaPostById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media article retrieved successfully for editing",
        data: result,
    });
});
const updateMediaPost = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await media_service_1.MediaService.updateMediaPost(req.params.id, req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media article updated successfully",
        data: result,
    });
});
const deleteMediaPost = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await media_service_1.MediaService.deleteMediaPost(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
exports.MediaController = {
    createMediaPost,
    getAllMediaPosts,
    getMediaPostBySlug,
    getMediaPostById,
    updateMediaPost,
    deleteMediaPost,
};
