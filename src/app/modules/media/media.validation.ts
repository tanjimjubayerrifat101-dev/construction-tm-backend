import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().min(1, "English text is required"),
  ar: z.string().min(1, "Arabic text is required"),
});

const optionalLocalizedStringSchema = z.object({
  en: z.string().optional().default(""),
  ar: z.string().optional().default(""),
});

const mediaImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  public_id: z.string().optional(),
});

const createMediaValidationSchema = z.object({
  body: z.object({
    slug: z.string().min(1, "Slug is required"),
    title: localizedStringSchema,
    category: localizedStringSchema,
    excerpt: localizedStringSchema,
    body: localizedStringSchema,
    image: mediaImageSchema.optional(),
    date: z.string().min(1, "Date (YYYY-MM-DD) is required"),
    author: optionalLocalizedStringSchema.optional(),
    readTime: optionalLocalizedStringSchema.optional(),
    isPublished: z.boolean().optional().default(true),
    order: z.number().optional().default(0),
  }),
});

const updateMediaValidationSchema = z.object({
  body: z.object({
    slug: z.string().optional(),
    title: localizedStringSchema.optional(),
    category: localizedStringSchema.optional(),
    excerpt: localizedStringSchema.optional(),
    body: localizedStringSchema.optional(),
    image: mediaImageSchema.optional(),
    date: z.string().optional(),
    author: optionalLocalizedStringSchema.optional(),
    readTime: optionalLocalizedStringSchema.optional(),
    isPublished: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

export const MediaValidation = {
  createMediaValidationSchema,
  updateMediaValidationSchema,
};
