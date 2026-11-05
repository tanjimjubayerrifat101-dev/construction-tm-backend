import mongoose from "mongoose";
import config from "../config";
import { User } from "../modules/auth/auth.model";

/**
 * Ensures the initial Super Admin account defined in .env exists in the database.
 * Can be called automatically on server startup or manually via `npm run seed`.
 */
export const seedSuperAdmin = async () => {
  try {
    if (!config.super_admin.email || !config.super_admin.password) {
      console.warn("⚠️  SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD is missing in .env. Skipping admin seed.");
      return;
    }

    const adminEmail = config.super_admin.email.trim().toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log(`⏳ Seeding Super Admin from .env (${adminEmail})...`);
      await User.create({
        name: config.super_admin.name || "Admin",
        email: adminEmail,
        password: config.super_admin.password,
        role: "ADMIN",
        status: "ACTIVE",
      });
      console.log("✅ Super Admin created successfully from .env.");
    } else {
      // Ensure admin remains active with ADMIN role
      if (existingAdmin.status !== "ACTIVE" || existingAdmin.role !== "ADMIN") {
        existingAdmin.status = "ACTIVE";
        existingAdmin.role = "ADMIN";
        await existingAdmin.save();
      }
      console.log(`ℹ️  Super Admin (${adminEmail}) is ready.`);
    }
  } catch (error) {
    console.error("❌ Error while ensuring Super Admin:", error);
  }
};

async function runStandaloneSeed() {
  try {
    if (!config.database_url) {
      console.error(
        "❌ DATABASE_URL is not defined in backend/.env! Please add your MongoDB URI before running the seed script."
      );
      process.exit(1);
    }

    console.log("⏳ Connecting to MongoDB for seeding...");
    await mongoose.connect(config.database_url);
    console.log("✅ Connected to MongoDB");

    await seedSuperAdmin();

    console.log("\n🎉 Admin Seeding Completed Successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error while seeding admin user:", error);
    process.exit(1);
  }
}

// Execute standalone when run via CLI (npm run seed)
if (require.main === module) {
  runStandaloneSeed();
}
