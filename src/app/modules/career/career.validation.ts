import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().min(1, "English text is required"),
  ar: z.string().min(1, "Arabic text is required"),
});

const localizedArraySchema = z.object({
  en: z.array(z.string()).default([]),
  ar: z.array(z.string()).default([]),
});

const jobRequirementsValidationSchema = z.object({
  education: localizedArraySchema.default({ en: [], ar: [] }),
  experience: localizedArraySchema.default({ en: [], ar: [] }),
  licensing: localizedArraySchema.default({ en: [], ar: [] }),
});

const createJobPositionValidationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, "Job identifier / slug is required"),
    title: localizedStringSchema,
    departmentId: z.enum([
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
    postedDate: z.string().min(1, "Posted date is required (YYYY-MM-DD)"),
    icon: z.string().optional().default("Briefcase"),
    overview: localizedStringSchema,
    responsibilities: localizedArraySchema,
    requirements: jobRequirementsValidationSchema,
    order: z.number().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateJobPositionValidationSchema = z.object({
  body: z.object({
    jobId: z.string().optional(),
    title: localizedStringSchema.optional(),
    departmentId: z
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
    postedDate: z.string().optional(),
    icon: z.string().optional(),
    overview: localizedStringSchema.optional(),
    responsibilities: localizedArraySchema.optional(),
    requirements: jobRequirementsValidationSchema.partial().optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

const createJobApplicationValidationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, "Job ID is required"),
    jobTitle: z.string().min(1, "Job Title is required"),
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    nationality: z.string().min(1, "Nationality is required"),
    currentCity: z.string().min(1, "Current city is required"),
    experience: z.string().min(1, "Experience is required"),
    noticePeriod: z.string().min(1, "Notice period is required"),
    currentEmployer: z.string().optional(),
    linkedin: z.string().optional(),
    coverNote: z.string().optional(),
    cv: z
      .object({
        url: z.string().url("Invalid CV URL"),
        public_id: z.string().optional(),
        filename: z.string().optional(),
      })
      .optional(),
  }),
});

const updateJobApplicationStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["Pending", "Reviewed", "Shortlisted", "Rejected"]),
  }),
});

export const CareerValidation = {
  createJobPositionValidationSchema,
  updateJobPositionValidationSchema,
  createJobApplicationValidationSchema,
  updateJobApplicationStatusValidationSchema,
};
