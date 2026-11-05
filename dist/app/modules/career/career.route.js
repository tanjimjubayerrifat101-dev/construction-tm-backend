"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const uploadImage_1 = require("../../utils/uploadImage");
const career_controller_1 = require("./career.controller");
const career_validation_1 = require("./career.validation");
const router = (0, express_1.Router)();
// Public endpoints
router.get("/", career_controller_1.CareerController.getAllJobPositions);
router.get("/:jobId", career_controller_1.CareerController.getJobPositionByJobId);
// Public Application submission (with CV document upload)
router.post("/apply", uploadImage_1.uploadDoc.single("cv"), (0, validateRequest_1.validateRequest)(career_validation_1.CareerValidation.createJobApplicationValidationSchema), career_controller_1.CareerController.submitJobApplication);
// Protected Admin Job Management endpoints
router.get("/admin/applications/all", (0, auth_1.auth)("ADMIN"), career_controller_1.CareerController.getAllJobApplications);
router.patch("/admin/applications/:id/status", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.validateRequest)(career_validation_1.CareerValidation.updateJobApplicationStatusValidationSchema), career_controller_1.CareerController.updateApplicationStatus);
router.delete("/admin/applications/:id", (0, auth_1.auth)("ADMIN"), career_controller_1.CareerController.deleteJobApplication);
router.get("/admin/:id", (0, auth_1.auth)("ADMIN"), career_controller_1.CareerController.getJobPositionById);
router.post("/", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.validateRequest)(career_validation_1.CareerValidation.createJobPositionValidationSchema), career_controller_1.CareerController.createJobPosition);
router.patch("/:id", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.validateRequest)(career_validation_1.CareerValidation.updateJobPositionValidationSchema), career_controller_1.CareerController.updateJobPosition);
router.delete("/:id", (0, auth_1.auth)("ADMIN"), career_controller_1.CareerController.deleteJobPosition);
exports.CareerRoutes = router;
