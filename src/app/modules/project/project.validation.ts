import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().min(1, "English text is required"),
  ar: z.string().min(1, "Arabic text is required"),
});

const projectImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  public_id: z.string().optional(),
});

const createProjectValidationSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required (e.g. proj-1)"),
    title: localizedStringSchema,
    sector: localizedStringSchema,
    sectorSlug: z.enum([
      "all",
      "systems-integration",
      "construction",
      "facility-services",
      "manpower",
      "environmental",
    ]),
    status: localizedStringSchema,
    statusCode: z.enum(["Ongoing", "Completed", "Planning"]),
    location: localizedStringSchema,
    regionId: z.string().min(1, "Region ID is required for Saudi presence map"),
    description: localizedStringSchema,
    value: localizedStringSchema,
    year: z.string().min(1, "Year is required"),
    progress: z.number().min(0).max(100),
    image: projectImageSchema.optional(),
    isFlagship: z.boolean().optional().default(false),
    order: z.number().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    title: localizedStringSchema.optional(),
    sector: localizedStringSchema.optional(),
    sectorSlug: z
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
    statusCode: z.enum(["Ongoing", "Completed", "Planning"]).optional(),
    location: localizedStringSchema.optional(),
    regionId: z.string().optional(),
    description: localizedStringSchema.optional(),
    value: localizedStringSchema.optional(),
    year: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
    image: projectImageSchema.optional(),
    isFlagship: z.boolean().optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ProjectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
