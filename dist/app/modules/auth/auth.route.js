"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const uploadImage_1 = require("../../utils/uploadImage");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
// Public Auth Endpoints
router.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthController.loginAdmin);
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
router.post("/forgot-password", (0, validateRequest_1.validateRequest)(auth_validation_1.AuthValidation.forgotPasswordValidationSchema), auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password", (0, validateRequest_1.validateRequest)(auth_validation_1.AuthValidation.resetPasswordValidationSchema), auth_controller_1.AuthController.resetPassword);
// Protected Admin Endpoints
router.get("/me", (0, auth_1.auth)("ADMIN"), auth_controller_1.AuthController.getMe);
router.patch("/update-me", (0, auth_1.auth)("ADMIN"), uploadImage_1.upload.single("avatar"), (0, validateRequest_1.validateRequest)(auth_validation_1.AuthValidation.updateProfileValidationSchema), auth_controller_1.AuthController.updateMe);
router.post("/change-password", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.validateRequest)(auth_validation_1.AuthValidation.changePasswordValidationSchema), auth_controller_1.AuthController.changePassword);
exports.AuthRoutes = router;
