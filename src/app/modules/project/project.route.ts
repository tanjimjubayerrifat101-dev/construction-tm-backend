import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { upload } from "../../utils/uploadImage";
import { ProjectController } from "./project.controller";
import { ProjectValidation } from "./project.validation";

const router = Router();

// Public endpoints
router.get("/", ProjectController.getAllProjects);
router.get("/presence-map", ProjectController.getPresenceMapData);
router.get("/detail/:projectId", ProjectController.getProjectByProjectId);

// Protected Admin endpoints
router.get("/admin/:id", auth("ADMIN"), ProjectController.getProjectById);

router.post(
  "/",
  auth("ADMIN"),
  upload.single("image"),
  validateRequest(ProjectValidation.createProjectValidationSchema),
  ProjectController.createProject
);

router.patch(
  "/:id",
  auth("ADMIN"),
  upload.single("image"),
  validateRequest(ProjectValidation.updateProjectValidationSchema),
  ProjectController.updateProject
);

router.delete("/:id", auth("ADMIN"), ProjectController.deleteProject);

export const ProjectRoutes = router;
