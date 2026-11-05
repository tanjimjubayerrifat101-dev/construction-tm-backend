import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { upload } from "../../utils/uploadImage";
import { MediaController } from "./media.controller";
import { MediaValidation } from "./media.validation";

const router = Router();

// Public endpoints
router.get("/", MediaController.getAllMediaPosts);
router.get("/:slug", MediaController.getMediaPostBySlug);

// Protected Admin endpoints
router.get("/admin/:id", auth("ADMIN"), MediaController.getMediaPostById);

router.post(
  "/",
  auth("ADMIN"),
  upload.single("image"),
  validateRequest(MediaValidation.createMediaValidationSchema),
  MediaController.createMediaPost
);

router.patch(
  "/:id",
  auth("ADMIN"),
  upload.single("image"),
  validateRequest(MediaValidation.updateMediaValidationSchema),
  MediaController.updateMediaPost
);

router.delete("/:id", auth("ADMIN"), MediaController.deleteMediaPost);

export const MediaRoutes = router;
