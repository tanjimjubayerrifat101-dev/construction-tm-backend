"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const uploadImage_1 = require("../../utils/uploadImage");
const service_controller_1 = require("./service.controller");
const service_validation_1 = require("./service.validation");
const router = (0, express_1.Router)();
// Public routes
router.get("/", service_controller_1.ServiceController.getAllServices);
router.get("/:slug", service_controller_1.ServiceController.getServiceBySlug);
// Admin Service CRUD
router.get("/admin/:id", (0, auth_1.auth)("ADMIN"), service_controller_1.ServiceController.getServiceById);
router.post("/", (0, auth_1.auth)("ADMIN"), uploadImage_1.upload.single("image"), (0, validateRequest_1.validateRequest)(service_validation_1.ServiceValidation.createServiceValidationSchema), service_controller_1.ServiceController.createService);
router.patch("/:id", (0, auth_1.auth)("ADMIN"), uploadImage_1.upload.single("image"), (0, validateRequest_1.validateRequest)(service_validation_1.ServiceValidation.updateServiceValidationSchema), service_controller_1.ServiceController.updateService);
router.delete("/:id", (0, auth_1.auth)("ADMIN"), service_controller_1.ServiceController.deleteService);
// Sub-Discipline (Tabs) Endpoints
router.post("/:id/sub-discipline", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.validateRequest)(service_validation_1.ServiceValidation.addSubDisciplineSchema), service_controller_1.ServiceController.addSubDiscipline);
router.patch("/:id/sub-discipline/:subId", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.validateRequest)(service_validation_1.ServiceValidation.updateSubDisciplineSchema), service_controller_1.ServiceController.updateSubDiscipline);
router.delete("/:id/sub-discipline/:subId", (0, auth_1.auth)("ADMIN"), service_controller_1.ServiceController.deleteSubDiscipline);
// Catalog Items Endpoints
router.post("/:id/catalog", (0, auth_1.auth)("ADMIN"), uploadImage_1.upload.single("image"), (0, validateRequest_1.validateRequest)(service_validation_1.ServiceValidation.addCatalogItemSchema), service_controller_1.ServiceController.addCatalogItem);
router.patch("/:id/catalog/:catalogId", (0, auth_1.auth)("ADMIN"), uploadImage_1.upload.single("image"), (0, validateRequest_1.validateRequest)(service_validation_1.ServiceValidation.updateCatalogItemSchema), service_controller_1.ServiceController.updateCatalogItem);
router.delete("/:id/catalog/:catalogId", (0, auth_1.auth)("ADMIN"), service_controller_1.ServiceController.deleteCatalogItem);
exports.ServiceRoutes = router;
