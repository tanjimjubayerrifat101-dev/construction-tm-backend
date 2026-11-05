"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("./app/config"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = require("./app/middlewares/notFound");
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// Security and performance middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        config_1.default.client_url,
        config_1.default.admin_url,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "25mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "25mb" }));
if (config_1.default.env === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TMYAZNA Construction API Server is Running Smoothly 🚀",
        version: "1.0.0",
        docs: "/api/v1",
    });
});
// Main API Route Prefix
app.use("/api/v1", routes_1.default);
// Global Error Handler & Not Found
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
