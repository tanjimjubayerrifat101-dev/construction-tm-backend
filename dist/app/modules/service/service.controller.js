"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const service_service_1 = require("./service.service");
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
const createService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.createService(req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Service created successfully",
        data: result,
    });
});
const getAllServices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lang = getRequestedLanguage(req);
    const result = await service_service_1.ServiceService.getAllServices(req.query, lang);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Services retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getServiceBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lang = getRequestedLanguage(req);
    const result = await service_service_1.ServiceService.getServiceBySlug(req.params.slug, lang);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service details retrieved successfully",
        data: result,
    });
});
const getServiceById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.getServiceById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service retrieved successfully for editing",
        data: result,
    });
});
const updateService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.updateService(req.params.id, req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service updated successfully",
        data: result,
    });
});
const deleteService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.deleteService(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
const addSubDiscipline = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.addSubDiscipline(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Sub-discipline added successfully",
        data: result,
    });
});
const updateSubDiscipline = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.updateSubDiscipline(req.params.id, req.params.subId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sub-discipline updated successfully",
        data: result,
    });
});
const deleteSubDiscipline = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.deleteSubDiscipline(req.params.id, req.params.subId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sub-discipline removed successfully",
        data: result,
    });
});
const addCatalogItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.addCatalogItem(req.params.id, req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Catalog item added successfully",
        data: result,
    });
});
const updateCatalogItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.updateCatalogItem(req.params.id, req.params.catalogId, req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Catalog item updated successfully",
        data: result,
    });
});
const deleteCatalogItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await service_service_1.ServiceService.deleteCatalogItem(req.params.id, req.params.catalogId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Catalog item removed successfully",
        data: result,
    });
});
exports.ServiceController = {
    createService,
    getAllServices,
    getServiceBySlug,
    getServiceById,
    updateService,
    deleteService,
    addSubDiscipline,
    updateSubDiscipline,
    deleteSubDiscipline,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
};
