import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CareerRoutes } from "../modules/career/career.route";
import { MediaRoutes } from "../modules/media/media.route";
import { ProjectRoutes } from "../modules/project/project.route";
import { ServiceRoutes } from "../modules/service/service.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/services",
    route: ServiceRoutes,
  },
  {
    path: "/projects",
    route: ProjectRoutes,
  },
  {
    path: "/media",
    route: MediaRoutes,
  },
  {
    path: "/careers",
    route: CareerRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
