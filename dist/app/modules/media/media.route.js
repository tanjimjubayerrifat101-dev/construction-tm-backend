"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const uploadImage_1 = require("../../utils/uploadImage");
const media_controller_1 = require("./media.controller");
const media_validation_1 = require("./media.validation");
const router = (0, express_1.Router)();
// Public endpoints
router.get("/", media_controller_1.MediaController.getAllMediaPosts);
router.get("/:slug", media_controller_1.MediaController.getMediaPostBySlug);
// Protected Admin endpoints
router.get("/admin/:id", (0, auth_1.auth)("ADMIN"), media_controller_1.MediaController.getMediaPostById);
router.post("/", (0, auth_1.auth)("ADMIN"), uploadImage_1.upload.single("image"), (0, validateRequest_1.validateRequest)(media_validation_1.MediaValidation.createMediaValidationSchema), media_controller_1.MediaController.createMediaPost);
router.patch("/:id", (0, auth_1.auth)("ADMIN"), uploadImage_1.upload.single("image"), (0, validateRequest_1.validateRequest)(media_validation_1.MediaValidation.updateMediaValidationSchema), media_controller_1.MediaController.updateMediaPost);
router.delete("/:id", (0, auth_1.auth)("ADMIN"), media_controller_1.MediaController.deleteMediaPost);
exports.MediaRoutes = router;
