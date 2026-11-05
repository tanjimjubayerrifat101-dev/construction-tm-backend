"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaValidation = void 0;
const zod_1 = require("zod");
const localizedStringSchema = zod_1.z.object({
    en: zod_1.z.string().min(1, "English text is required"),
    ar: zod_1.z.string().min(1, "Arabic text is required"),
});
const optionalLocalizedStringSchema = zod_1.z.object({
    en: zod_1.z.string().optional().default(""),
    ar: zod_1.z.string().optional().default(""),
});
const mediaImageSchema = zod_1.z.object({
    url: zod_1.z.string().url("Invalid image URL"),
    public_id: zod_1.z.string().optional(),
});
const createMediaValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        slug: zod_1.z.string().min(1, "Slug is required"),
        title: localizedStringSchema,
        category: localizedStringSchema,
        excerpt: localizedStringSchema,
        body: localizedStringSchema,
        image: mediaImageSchema.optional(),
        date: zod_1.z.string().min(1, "Date (YYYY-MM-DD) is required"),
        author: optionalLocalizedStringSchema.optional(),
        readTime: optionalLocalizedStringSchema.optional(),
        isPublished: zod_1.z.boolean().optional().default(true),
        order: zod_1.z.number().optional().default(0),
    }),
});
const updateMediaValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        slug: zod_1.z.string().optional(),
        title: localizedStringSchema.optional(),
        category: localizedStringSchema.optional(),
        excerpt: localizedStringSchema.optional(),
        body: localizedStringSchema.optional(),
        image: mediaImageSchema.optional(),
        date: zod_1.z.string().optional(),
        author: optionalLocalizedStringSchema.optional(),
        readTime: optionalLocalizedStringSchema.optional(),
        isPublished: zod_1.z.boolean().optional(),
        order: zod_1.z.number().optional(),
    }),
});
exports.MediaValidation = {
    createMediaValidationSchema,
    updateMediaValidationSchema,
};
