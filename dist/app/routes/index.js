"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const career_route_1 = require("../modules/career/career.route");
const media_route_1 = require("../modules/media/media.route");
const project_route_1 = require("../modules/project/project.route");
const service_route_1 = require("../modules/service/service.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/services",
        route: service_route_1.ServiceRoutes,
    },
    {
        path: "/projects",
        route: project_route_1.ProjectRoutes,
    },
    {
        path: "/media",
        route: media_route_1.MediaRoutes,
    },
    {
        path: "/careers",
        route: career_route_1.CareerRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
