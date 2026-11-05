"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const auth_model_1 = require("../modules/auth/auth.model");
const service_model_1 = require("../modules/service/service.model");
const seedData_1 = require("./seedData");
async function seedDatabase() {
    try {
        if (!config_1.default.database_url) {
            console.error("❌ DATABASE_URL is not defined in backend/.env! Please add your MongoDB URI before running the seed script.");
            process.exit(1);
        }
        console.log("⏳ Connecting to MongoDB for seeding...");
        await mongoose_1.default.connect(config_1.default.database_url);
        console.log("✅ Connected to MongoDB");
        // 1. Seed Super Admin
        const isSuperAdminExists = await auth_model_1.User.findOne({
            email: config_1.default.super_admin.email,
        });
        if (!isSuperAdminExists) {
            console.log(`⏳ Seeding initial Super Admin (${config_1.default.super_admin.email})...`);
            await auth_model_1.User.create({
                name: config_1.default.super_admin.name,
                email: config_1.default.super_admin.email,
                password: config_1.default.super_admin.password,
                role: "ADMIN",
                status: "ACTIVE",
            });
            console.log("✅ Initial Admin user created successfully.");
        }
        else {
            console.log("ℹ️  Admin user already exists. Skipping admin creation.");
        }
        // 2. Seed Initial Services
        console.log("⏳ Seeding initial services with bilingual (English & Arabic) data...");
        for (const service of seedData_1.initialServicesData) {
            const existingService = await service_model_1.Service.findOne({ slug: service.slug });
            if (!existingService) {
                await service_model_1.Service.create(service);
                console.log(`   + Added service: ${service.name.en} / ${service.name.ar}`);
            }
            else {
                console.log(`   ℹ️ Service '${service.slug}' already exists. Skipping.`);
            }
        }
        console.log("\n🎉 Database Seeding Completed Successfully!");
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error while seeding database:", error);
        process.exit(1);
    }
}
seedDatabase();
