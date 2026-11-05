"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const project_service_1 = require("./project.service");
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
const createProject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await project_service_1.ProjectService.createProject(req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Project created successfully",
        data: result,
    });
});
const getAllProjects = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lang = getRequestedLanguage(req);
    const result = await project_service_1.ProjectService.getAllProjects(req.query, lang);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Projects retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getProjectByProjectId = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lang = getRequestedLanguage(req);
    const result = await project_service_1.ProjectService.getProjectByProjectId(req.params.projectId, lang);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Project details retrieved successfully",
        data: result,
    });
});
const getProjectById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await project_service_1.ProjectService.getProjectById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Project retrieved successfully for editing",
        data: result,
    });
});
const updateProject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await project_service_1.ProjectService.updateProject(req.params.id, req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Project updated successfully",
        data: result,
    });
});
const deleteProject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await project_service_1.ProjectService.deleteProject(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
const getPresenceMapData = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lang = getRequestedLanguage(req);
    const result = await project_service_1.ProjectService.getPresenceMapData(lang);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Presence map regional projects retrieved successfully",
        data: result,
    });
});
exports.ProjectController = {
    createProject,
    getAllProjects,
    getProjectByProjectId,
    getProjectById,
    updateProject,
    deleteProject,
    getPresenceMapData,
};
