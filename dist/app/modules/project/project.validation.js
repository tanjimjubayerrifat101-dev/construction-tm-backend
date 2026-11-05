"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidation = void 0;
const zod_1 = require("zod");
const localizedStringSchema = zod_1.z.object({
    en: zod_1.z.string().min(1, "English text is required"),
    ar: zod_1.z.string().min(1, "Arabic text is required"),
});
const projectImageSchema = zod_1.z.object({
    url: zod_1.z.string().url("Invalid image URL"),
    public_id: zod_1.z.string().optional(),
});
const createProjectValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        projectId: zod_1.z.string().min(1, "Project ID is required (e.g. proj-1)"),
        title: localizedStringSchema,
        sector: localizedStringSchema,
        sectorSlug: zod_1.z.enum([
            "all",
            "systems-integration",
            "construction",
            "facility-services",
            "manpower",
            "environmental",
        ]),
        status: localizedStringSchema,
        statusCode: zod_1.z.enum(["Ongoing", "Completed", "Planning"]),
        location: localizedStringSchema,
        regionId: zod_1.z.string().min(1, "Region ID is required for Saudi presence map"),
        description: localizedStringSchema,
        value: localizedStringSchema,
        year: zod_1.z.string().min(1, "Year is required"),
        progress: zod_1.z.number().min(0).max(100),
        image: projectImageSchema.optional(),
        isFlagship: zod_1.z.boolean().optional().default(false),
        order: zod_1.z.number().optional().default(0),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
const updateProjectValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        projectId: zod_1.z.string().optional(),
        title: localizedStringSchema.optional(),
        sector: localizedStringSchema.optional(),
        sectorSlug: zod_1.z
            .enum([
            "all",
            "systems-integration",
            "construction",
            "facility-services",
            "manpower",
            "environmental",
        ])
            .optional(),
        status: localizedStringSchema.optional(),
        statusCode: zod_1.z.enum(["Ongoing", "Completed", "Planning"]).optional(),
        location: localizedStringSchema.optional(),
        regionId: zod_1.z.string().optional(),
        description: localizedStringSchema.optional(),
        value: localizedStringSchema.optional(),
        year: zod_1.z.string().optional(),
        progress: zod_1.z.number().min(0).max(100).optional(),
        image: projectImageSchema.optional(),
        isFlagship: zod_1.z.boolean().optional(),
        order: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.ProjectValidation = {
    createProjectValidationSchema,
    updateProjectValidationSchema,
};
