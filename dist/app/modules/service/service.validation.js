"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceValidation = void 0;
const zod_1 = require("zod");
const localizedStringSchema = zod_1.z.object({
    en: zod_1.z.string().min(1, "English text is required"),
    ar: zod_1.z.string().min(1, "Arabic text is required"),
});
const optionalLocalizedStringSchema = zod_1.z.object({
    en: zod_1.z.string().optional().default(""),
    ar: zod_1.z.string().optional().default(""),
});
const localizedArraySchema = zod_1.z.object({
    en: zod_1.z.array(zod_1.z.string()).default([]),
    ar: zod_1.z.array(zod_1.z.string()).default([]),
});
const serviceImageSchema = zod_1.z.object({
    url: zod_1.z.string().url("Invalid image URL"),
    public_id: zod_1.z.string().optional(),
});
const subDisciplineValidationSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Sub discipline ID is required"),
    tabTitle: localizedStringSchema,
    heading: localizedStringSchema,
    description: localizedStringSchema,
    capabilitiesHeading: optionalLocalizedStringSchema.optional(),
    capabilities: localizedArraySchema.optional(),
    icon: zod_1.z.string().optional().default("Settings"),
});
const catalogItemValidationSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Catalog item ID is required"),
    title: localizedStringSchema,
    description: localizedStringSchema,
    image: serviceImageSchema,
    badge: optionalLocalizedStringSchema.optional(),
});
const createServiceValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        slug: zod_1.z.string().min(1, "Slug is required"),
        number: zod_1.z.string().min(1, "Service number (e.g. 01) is required"),
        name: localizedStringSchema,
        shortTitle: localizedStringSchema,
        heading: localizedStringSchema,
        description: localizedStringSchema,
        icon: zod_1.z.string().min(1, "Icon is required"),
        image: serviceImageSchema.optional(), // Can also be uploaded via multipart/form-data
        tabHeading: optionalLocalizedStringSchema.optional(),
        coreCapabilitiesHeading: optionalLocalizedStringSchema.optional(),
        coreDescription: optionalLocalizedStringSchema.optional(),
        coreCapabilities: localizedArraySchema.optional(),
        catalogHeading: optionalLocalizedStringSchema.optional(),
        subDisciplines: zod_1.z.array(subDisciplineValidationSchema).optional(),
        catalogItems: zod_1.z.array(catalogItemValidationSchema).optional(),
        order: zod_1.z.number().optional().default(0),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
const updateServiceValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        slug: zod_1.z.string().optional(),
        number: zod_1.z.string().optional(),
        name: localizedStringSchema.optional(),
        shortTitle: localizedStringSchema.optional(),
        heading: localizedStringSchema.optional(),
        description: localizedStringSchema.optional(),
        icon: zod_1.z.string().optional(),
        image: serviceImageSchema.optional(),
        tabHeading: optionalLocalizedStringSchema.optional(),
        coreCapabilitiesHeading: optionalLocalizedStringSchema.optional(),
        coreDescription: optionalLocalizedStringSchema.optional(),
        coreCapabilities: localizedArraySchema.optional(),
        catalogHeading: optionalLocalizedStringSchema.optional(),
        subDisciplines: zod_1.z.array(subDisciplineValidationSchema).optional(),
        catalogItems: zod_1.z.array(catalogItemValidationSchema).optional(),
        order: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const addSubDisciplineSchema = zod_1.z.object({
    body: subDisciplineValidationSchema,
});
const updateSubDisciplineSchema = zod_1.z.object({
    body: subDisciplineValidationSchema.partial(),
});
const addCatalogItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().min(1, "Catalog item ID is required"),
        title: localizedStringSchema,
        description: localizedStringSchema,
        image: serviceImageSchema.optional(),
        badge: optionalLocalizedStringSchema.optional(),
    }),
});
const updateCatalogItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: localizedStringSchema.optional(),
        description: localizedStringSchema.optional(),
        image: serviceImageSchema.optional(),
        badge: optionalLocalizedStringSchema.optional(),
    }),
});
exports.ServiceValidation = {
    createServiceValidationSchema,
    updateServiceValidationSchema,
    addSubDisciplineSchema,
    updateSubDisciplineSchema,
    addCatalogItemSchema,
    updateCatalogItemSchema,
};
