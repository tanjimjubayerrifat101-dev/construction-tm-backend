import { Schema, model } from "mongoose";
import { IProject } from "./project.interface";

const localizedStringSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const projectImageSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, default: "" },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    projectId: {
      type: String,
      required: [true, "Project ID is required (e.g. proj-1)"],
      unique: true,
      trim: true,
    },
    title: {
      type: localizedStringSchema,
      required: [true, "Project title (en and ar) is required"],
    },
    sector: {
      type: localizedStringSchema,
      required: [true, "Sector name (en and ar) is required"],
    },
    sectorSlug: {
      type: String,
      enum: [
        "all",
        "systems-integration",
        "construction",
        "facility-services",
        "manpower",
        "environmental",
      ],
      required: [true, "Sector slug is required"],
    },
    status: {
      type: localizedStringSchema,
      required: [true, "Status label (en and ar) is required"],
    },
    statusCode: {
      type: String,
      enum: ["Ongoing", "Completed", "Planning"],
      default: "Ongoing",
    },
    location: {
      type: localizedStringSchema,
      required: [true, "Location (en and ar) is required"],
    },
    regionId: {
      type: String,
      required: [true, "Region ID is required for Saudi Map presence"],
      trim: true,
      lowercase: true,
    },
    description: {
      type: localizedStringSchema,
      required: [true, "Description (en and ar) is required"],
    },
    value: {
      type: localizedStringSchema,
      required: [true, "Project value (en and ar) is required"],
    },
    year: {
      type: String,
      required: [true, "Completion/target year is required"],
      trim: true,
    },
    progress: {
      type: Number,
      required: [true, "Project progress percentage (0-100) is required"],
      min: 0,
      max: 100,
      default: 0,
    },
    image: {
      type: projectImageSchema,
      required: [true, "Project cover image is required"],
    },
    isFlagship: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ regionId: 1 });
projectSchema.index({ sectorSlug: 1 });
projectSchema.index({ statusCode: 1 });
projectSchema.index({ isFlagship: 1 });
projectSchema.index({ order: 1 });
projectSchema.index({ isActive: 1 });

export const Project = model<IProject>("Project", projectSchema);
