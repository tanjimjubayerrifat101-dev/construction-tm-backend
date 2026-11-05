import { Schema, model } from "mongoose";
import { IMediaPost } from "./media.interface";

const localizedStringSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const optionalLocalizedStringSchema = new Schema(
  {
    en: { type: String, trim: true, default: "" },
    ar: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const mediaImageSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, default: "" },
  },
  { _id: false }
);

const mediaPostSchema = new Schema<IMediaPost>(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: localizedStringSchema,
      required: [true, "Title (en and ar) is required"],
    },
    category: {
      type: localizedStringSchema,
      required: [true, "Category (en and ar) is required"],
    },
    excerpt: {
      type: localizedStringSchema,
      required: [true, "Excerpt (en and ar) is required"],
    },
    body: {
      type: localizedStringSchema,
      required: [true, "Body article content (en and ar) is required"],
    },
    image: {
      type: mediaImageSchema,
      required: [true, "Cover image is required"],
    },
    date: {
      type: String,
      required: [true, "Publication date (YYYY-MM-DD) is required"],
      trim: true,
    },
    author: {
      type: optionalLocalizedStringSchema,
    },
    readTime: {
      type: optionalLocalizedStringSchema,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

mediaPostSchema.index({ isPublished: 1 });
mediaPostSchema.index({ date: -1 });
mediaPostSchema.index({ order: 1 });

export const MediaPost = model<IMediaPost>("MediaPost", mediaPostSchema);
