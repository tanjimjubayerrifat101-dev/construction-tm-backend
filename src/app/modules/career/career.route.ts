import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { uploadDoc } from "../../utils/uploadImage";
import { CareerController } from "./career.controller";
import { CareerValidation } from "./career.validation";

const router = Router();

// Public endpoints
router.get("/", CareerController.getAllJobPositions);
router.get("/:jobId", CareerController.getJobPositionByJobId);

// Public Application submission (with CV document upload)
router.post(
  "/apply",
  uploadDoc.single("cv"),
  validateRequest(CareerValidation.createJobApplicationValidationSchema),
  CareerController.submitJobApplication
);

// Protected Admin Job Management endpoints
router.get(
  "/admin/applications/all",
  auth("ADMIN"),
  CareerController.getAllJobApplications
);

router.patch(
  "/admin/applications/:id/status",
  auth("ADMIN"),
  validateRequest(CareerValidation.updateJobApplicationStatusValidationSchema),
  CareerController.updateApplicationStatus
);

router.delete(
  "/admin/applications/:id",
  auth("ADMIN"),
  CareerController.deleteJobApplication
);

router.get("/admin/:id", auth("ADMIN"), CareerController.getJobPositionById);

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(CareerValidation.createJobPositionValidationSchema),
  CareerController.createJobPosition
);

router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(CareerValidation.updateJobPositionValidationSchema),
  CareerController.updateJobPosition
);

router.delete("/:id", auth("ADMIN"), CareerController.deleteJobPosition);

export const CareerRoutes = router;
