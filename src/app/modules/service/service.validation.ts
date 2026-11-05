import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().min(1, "English text is required"),
  ar: z.string().min(1, "Arabic text is required"),
});

const optionalLocalizedStringSchema = z.object({
  en: z.string().optional().default(""),
  ar: z.string().optional().default(""),
});

const localizedArraySchema = z.object({
  en: z.array(z.string()).default([]),
  ar: z.array(z.string()).default([]),
});

const serviceImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  public_id: z.string().optional(),
});

const subDisciplineValidationSchema = z.object({
  id: z.string().min(1, "Sub discipline ID is required"),
  tabTitle: localizedStringSchema,
  heading: localizedStringSchema,
  description: localizedStringSchema,
  capabilitiesHeading: optionalLocalizedStringSchema.optional(),
  capabilities: localizedArraySchema.optional(),
  icon: z.string().optional().default("Settings"),
});

const catalogItemValidationSchema = z.object({
  id: z.string().min(1, "Catalog item ID is required"),
  title: localizedStringSchema,
  description: localizedStringSchema,
  image: serviceImageSchema,
  badge: optionalLocalizedStringSchema.optional(),
});

const createServiceValidationSchema = z.object({
  body: z.object({
    slug: z.string().min(1, "Slug is required"),
    number: z.string().min(1, "Service number (e.g. 01) is required"),
    name: localizedStringSchema,
    shortTitle: localizedStringSchema,
    heading: localizedStringSchema,
    description: localizedStringSchema,
    icon: z.string().min(1, "Icon is required"),
    image: serviceImageSchema.optional(), // Can also be uploaded via multipart/form-data
    tabHeading: optionalLocalizedStringSchema.optional(),
    coreCapabilitiesHeading: optionalLocalizedStringSchema.optional(),
    coreDescription: optionalLocalizedStringSchema.optional(),
    coreCapabilities: localizedArraySchema.optional(),
    catalogHeading: optionalLocalizedStringSchema.optional(),
    subDisciplines: z.array(subDisciplineValidationSchema).optional(),
    catalogItems: z.array(catalogItemValidationSchema).optional(),
    order: z.number().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateServiceValidationSchema = z.object({
  body: z.object({
    slug: z.string().optional(),
    number: z.string().optional(),
    name: localizedStringSchema.optional(),
    shortTitle: localizedStringSchema.optional(),
    heading: localizedStringSchema.optional(),
    description: localizedStringSchema.optional(),
    icon: z.string().optional(),
    image: serviceImageSchema.optional(),
    tabHeading: optionalLocalizedStringSchema.optional(),
    coreCapabilitiesHeading: optionalLocalizedStringSchema.optional(),
    coreDescription: optionalLocalizedStringSchema.optional(),
    coreCapabilities: localizedArraySchema.optional(),
    catalogHeading: optionalLocalizedStringSchema.optional(),
    subDisciplines: z.array(subDisciplineValidationSchema).optional(),
    catalogItems: z.array(catalogItemValidationSchema).optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

const addSubDisciplineSchema = z.object({
  body: subDisciplineValidationSchema,
});

const updateSubDisciplineSchema = z.object({
  body: subDisciplineValidationSchema.partial(),
});

const addCatalogItemSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Catalog item ID is required"),
    title: localizedStringSchema,
    description: localizedStringSchema,
    image: serviceImageSchema.optional(),
    badge: optionalLocalizedStringSchema.optional(),
  }),
});

const updateCatalogItemSchema = z.object({
  body: z.object({
    title: localizedStringSchema.optional(),
    description: localizedStringSchema.optional(),
    image: serviceImageSchema.optional(),
    badge: optionalLocalizedStringSchema.optional(),
  }),
});

export const ServiceValidation = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
  addSubDisciplineSchema,
  updateSubDisciplineSchema,
  addCatalogItemSchema,
  updateCatalogItemSchema,
};
