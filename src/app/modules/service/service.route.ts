import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { upload } from "../../utils/uploadImage";
import { ServiceController } from "./service.controller";
import { ServiceValidation } from "./service.validation";

const router = Router();

// Public routes
router.get("/", ServiceController.getAllServices);
router.get("/:slug", ServiceController.getServiceBySlug);

// Admin Service CRUD
router.get("/admin/:id", auth("ADMIN"), ServiceController.getServiceById);

router.post(
  "/",
  auth("ADMIN"),
  upload.single("image"),
  validateRequest(ServiceValidation.createServiceValidationSchema),
  ServiceController.createService
);

router.patch(
  "/:id",
  auth("ADMIN"),
  upload.single("image"),
  validateRequest(ServiceValidation.updateServiceValidationSchema),
  ServiceController.updateService
);

router.delete("/:id", auth("ADMIN"), ServiceController.deleteService);

// Sub-Discipline (Tabs) Endpoints
router.post(
  "/:id/sub-discipline",
  auth("ADMIN"),
  validateRequest(ServiceValidation.addSubDisciplineSchema),
  ServiceController.addSubDiscipline
);

router.patch(
  "/:id/sub-discipline/:subId",
  auth("ADMIN"),
  validateRequest(ServiceValidation.updateSubDisciplineSchema),
  ServiceController.updateSubDiscipline
);

router.delete(
  "/:id/sub-discipline/:subId",
  auth("ADMIN"),
  ServiceController.deleteSubDiscipline
);

// Catalog Items Endpoints
router.post(
  "/:id/catalog",
  auth("ADMIN"),
  upload.single("image"),
  validateRequest(ServiceValidation.addCatalogItemSchema),
  ServiceController.addCatalogItem
);

router.patch(
  "/:id/catalog/:catalogId",
  auth("ADMIN"),
  upload.single("image"),
  validateRequest(ServiceValidation.updateCatalogItemSchema),
  ServiceController.updateCatalogItem
);

router.delete(
  "/:id/catalog/:catalogId",
  auth("ADMIN"),
  ServiceController.deleteCatalogItem
);

export const ServiceRoutes = router;
