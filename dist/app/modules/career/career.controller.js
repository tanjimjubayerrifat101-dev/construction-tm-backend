"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const career_service_1 = require("./career.service");
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
const createJobPosition = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await career_service_1.CareerService.createJobPosition(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Job position created successfully",
        data: result,
    });
});
const getAllJobPositions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lang = getRequestedLanguage(req);
    const result = await career_service_1.CareerService.getAllJobPositions(req.query, lang);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job positions retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getJobPositionByJobId = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lang = getRequestedLanguage(req);
    const result = await career_service_1.CareerService.getJobPositionByJobId(req.params.jobId, lang);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job position details retrieved successfully",
        data: result,
    });
});
const getJobPositionById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await career_service_1.CareerService.getJobPositionById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job position retrieved successfully for editing",
        data: result,
    });
});
const updateJobPosition = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await career_service_1.CareerService.updateJobPosition(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job position updated successfully",
        data: result,
    });
});
const deleteJobPosition = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await career_service_1.CareerService.deleteJobPosition(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
// Application Endpoints
const submitJobApplication = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await career_service_1.CareerService.submitJobApplication(req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Job application submitted successfully",
        data: result,
    });
});
const getAllJobApplications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await career_service_1.CareerService.getAllJobApplications(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job applications retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const updateApplicationStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await career_service_1.CareerService.updateApplicationStatus(req.params.id, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Application status updated successfully",
        data: result,
    });
});
const deleteJobApplication = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await career_service_1.CareerService.deleteJobApplication(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
exports.CareerController = {
    createJobPosition,
    getAllJobPositions,
    getJobPositionByJobId,
    getJobPositionById,
    updateJobPosition,
    deleteJobPosition,
    submitJobApplication,
    getAllJobApplications,
    updateApplicationStatus,
    deleteJobApplication,
};
