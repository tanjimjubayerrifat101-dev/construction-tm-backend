"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerValidation = void 0;
const zod_1 = require("zod");
const localizedStringSchema = zod_1.z.object({
    en: zod_1.z.string().min(1, "English text is required"),
    ar: zod_1.z.string().min(1, "Arabic text is required"),
});
const localizedArraySchema = zod_1.z.object({
    en: zod_1.z.array(zod_1.z.string()).default([]),
    ar: zod_1.z.array(zod_1.z.string()).default([]),
});
const jobRequirementsValidationSchema = zod_1.z.object({
    education: localizedArraySchema.default({ en: [], ar: [] }),
    experience: localizedArraySchema.default({ en: [], ar: [] }),
    licensing: localizedArraySchema.default({ en: [], ar: [] }),
});
const createJobPositionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobId: zod_1.z.string().min(1, "Job identifier / slug is required"),
        title: localizedStringSchema,
        departmentId: zod_1.z.enum([
            "systems-integration",
            "construction",
            "facility-services",
            "environmental",
            "manpower",
        ]),
        department: localizedStringSchema,
        location: localizedStringSchema,
        type: localizedStringSchema,
        experience: localizedStringSchema,
        postedDate: zod_1.z.string().min(1, "Posted date is required (YYYY-MM-DD)"),
        icon: zod_1.z.string().optional().default("Briefcase"),
        overview: localizedStringSchema,
        responsibilities: localizedArraySchema,
        requirements: jobRequirementsValidationSchema,
        order: zod_1.z.number().optional().default(0),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
const updateJobPositionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobId: zod_1.z.string().optional(),
        title: localizedStringSchema.optional(),
        departmentId: zod_1.z
            .enum([
            "systems-integration",
            "construction",
            "facility-services",
            "environmental",
            "manpower",
        ])
            .optional(),
        department: localizedStringSchema.optional(),
        location: localizedStringSchema.optional(),
        type: localizedStringSchema.optional(),
        experience: localizedStringSchema.optional(),
        postedDate: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        overview: localizedStringSchema.optional(),
        responsibilities: localizedArraySchema.optional(),
        requirements: jobRequirementsValidationSchema.partial().optional(),
        order: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const createJobApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobId: zod_1.z.string().min(1, "Job ID is required"),
        jobTitle: zod_1.z.string().min(1, "Job Title is required"),
        fullName: zod_1.z.string().min(1, "Full name is required"),
        email: zod_1.z.string().email("Invalid email address"),
        phone: zod_1.z.string().min(1, "Phone number is required"),
        nationality: zod_1.z.string().min(1, "Nationality is required"),
        currentCity: zod_1.z.string().min(1, "Current city is required"),
        experience: zod_1.z.string().min(1, "Experience is required"),
        noticePeriod: zod_1.z.string().min(1, "Notice period is required"),
        currentEmployer: zod_1.z.string().optional(),
        linkedin: zod_1.z.string().optional(),
        coverNote: zod_1.z.string().optional(),
        cv: zod_1.z
            .object({
            url: zod_1.z.string().url("Invalid CV URL"),
            public_id: zod_1.z.string().optional(),
            filename: zod_1.z.string().optional(),
        })
            .optional(),
    }),
});
const updateJobApplicationStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["Pending", "Reviewed", "Shortlisted", "Rejected"]),
    }),
});
exports.CareerValidation = {
    createJobPositionValidationSchema,
    updateJobPositionValidationSchema,
    createJobApplicationValidationSchema,
    updateJobApplicationStatusValidationSchema,
};
