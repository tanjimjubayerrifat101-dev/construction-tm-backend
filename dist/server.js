"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
let server;
async function bootstrap() {
    try {
        if (!config_1.default.database_url) {
            console.warn("⚠️  DATABASE_URL is not set in .env! MongoDB connection skipped for now. Set DATABASE_URL to connect to your database.");
        }
        else {
            await mongoose_1.default.connect(config_1.default.database_url);
            console.log(" Connected to MongoDB Database successfully");
        }
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`🚀 TMYAZNA Server is listening on http://localhost:${config_1.default.port}`);
            console.log(`🌐 API base URL: http://localhost:${config_1.default.port}/api/v1`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
bootstrap();
process.on("unhandledRejection", (error) => {
    console.error("🚨 Unhandled Rejection detected, shutting down server:", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("uncaughtException", (error) => {
    console.error("🚨 Uncaught Exception detected:", error);
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received, shutting down gracefully");
    if (server) {
        server.close();
    }
});
