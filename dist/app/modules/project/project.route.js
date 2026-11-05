"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const uploadImage_1 = require("../../utils/uploadImage");
const project_controller_1 = require("./project.controller");
const project_validation_1 = require("./project.validation");
const router = (0, express_1.Router)();
// Public endpoints
router.get("/", project_controller_1.ProjectController.getAllProjects);
router.get("/presence-map", project_controller_1.ProjectController.getPresenceMapData);
router.get("/detail/:projectId", project_controller_1.ProjectController.getProjectByProjectId);
// Protected Admin endpoints
router.get("/admin/:id", (0, auth_1.auth)("ADMIN"), project_controller_1.ProjectController.getProjectById);
router.post("/", (0, auth_1.auth)("ADMIN"), uploadImage_1.upload.single("image"), (0, validateRequest_1.validateRequest)(project_validation_1.ProjectValidation.createProjectValidationSchema), project_controller_1.ProjectController.createProject);
router.patch("/:id", (0, auth_1.auth)("ADMIN"), uploadImage_1.upload.single("image"), (0, validateRequest_1.validateRequest)(project_validation_1.ProjectValidation.updateProjectValidationSchema), project_controller_1.ProjectController.updateProject);
router.delete("/:id", (0, auth_1.auth)("ADMIN"), project_controller_1.ProjectController.deleteProject);
exports.ProjectRoutes = router;
