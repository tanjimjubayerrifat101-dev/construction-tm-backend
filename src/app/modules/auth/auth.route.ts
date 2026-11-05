import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { upload } from "../../utils/uploadImage";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

// Public Auth Endpoints
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginAdmin
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

// Protected Admin Endpoints
router.get("/me", auth("ADMIN"), AuthController.getMe);

router.patch(
  "/update-me",
  auth("ADMIN"),
  upload.single("avatar"),
  validateRequest(AuthValidation.updateProfileValidationSchema),
  AuthController.updateMe
);

router.post(
  "/change-password",
  auth("ADMIN"),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
