import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { seedSuperAdmin } from "./app/seed/seed";

let server: Server;

async function bootstrap() {
  try {
    if (!config.database_url) {
      console.warn(
        "⚠️  DATABASE_URL is not set in .env! MongoDB connection skipped for now. Set DATABASE_URL to connect to your database."
      );
    } else {
      await mongoose.connect(config.database_url);
      console.log(" Connected to MongoDB Database successfully");
      await seedSuperAdmin();
    }

    server = app.listen(config.port, () => {
      console.log(
        `🚀 TMYAZNA Server is listening on http://localhost:${config.port}`
      );
      console.log(`🌐 API base URL: http://localhost:${config.port}/api/v1`);
    });
  } catch (error) {
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
  } else {
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
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
