import { AppError } from "../../errors/AppError";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/uploadImage";
import { IMediaPost } from "./media.interface";
import { MediaPost } from "./media.model";

export const formatLocalizedMediaPost = (
  post: IMediaPost,
  lang?: "en" | "ar" | string
) => {
  if (!lang || (lang !== "en" && lang !== "ar")) {
    return post;
  }

  const isAr = lang === "ar";
  const selectStr = (field?: { en: string; ar: string }) => {
    if (!field) return "";
    return isAr ? field.ar || field.en : field.en || field.ar;
  };

  return {
    _id: post._id,
    slug: post.slug,
    title: selectStr(post.title),
    category: selectStr(post.category),
    excerpt: selectStr(post.excerpt),
    body: selectStr(post.body),
    image: post.image,
    date: post.date,
    author: selectStr(post.author),
    readTime: selectStr(post.readTime),
    isPublished: post.isPublished,
    order: post.order,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

const createMediaPost = async (
  payload: Partial<IMediaPost>,
  file?: Express.Multer.File
) => {
  const existing = await MediaPost.findOne({ slug: payload.slug });
  if (existing) {
    throw new AppError(400, `Article with slug '${payload.slug}' already exists.`);
  }

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, "tmyazna/media");
    payload.image = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
  } else if (!payload.image?.url) {
    throw new AppError(400, "Media cover image is required.");
  }

  const post = await MediaPost.create(payload);
  return post;
};

const getAllMediaPosts = async (
  query: Record<string, unknown>,
  lang?: string
) => {
  const filter: Record<string, unknown> = {};

  if (query.isPublished !== undefined) {
    filter.isPublished = query.isPublished === "true";
  }

  if (query.category) {
    const categoryRegex = new RegExp(query.category as string, "i");
    filter.$or = [
      { "category.en": categoryRegex },
      { "category.ar": categoryRegex },
    ];
  }

  if (query.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm as string, "i");
    filter.$or = [
      { slug: searchRegex },
      { "title.en": searchRegex },
      { "title.ar": searchRegex },
      { "excerpt.en": searchRegex },
      { "excerpt.ar": searchRegex },
      { "body.en": searchRegex },
      { "body.ar": searchRegex },
    ];
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;

  const total = await MediaPost.countDocuments(filter);
  const posts = await MediaPost.find(filter)
    .sort({ order: 1, date: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: posts.map((p) => formatLocalizedMediaPost(p, lang)),
  };
};

const getMediaPostBySlug = async (slug: string, lang?: string) => {
  const post = await MediaPost.findOne({ slug, isPublished: true });
  if (!post) {
    throw new AppError(404, `Media article with slug '${slug}' not found.`);
  }

  return formatLocalizedMediaPost(post, lang);
};

const getMediaPostById = async (id: string) => {
  const post = await MediaPost.findById(id);
  if (!post) {
    throw new AppError(404, "Article not found.");
  }
  return post;
};

const updateMediaPost = async (
  id: string,
  payload: Partial<IMediaPost>,
  file?: Express.Multer.File
) => {
  const post = await MediaPost.findById(id);
  if (!post) {
    throw new AppError(404, "Article not found.");
  }

  if (payload.slug && payload.slug !== post.slug) {
    const existing = await MediaPost.findOne({ slug: payload.slug });
    if (existing) {
      throw new AppError(400, `Article with slug '${payload.slug}' already exists.`);
    }
  }

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, "tmyazna/media");
    payload.image = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
    if (post.image?.public_id) {
      await deleteFromCloudinary(post.image.public_id);
    }
  }

  const updated = await MediaPost.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return updated;
};

const deleteMediaPost = async (id: string) => {
  const post = await MediaPost.findById(id);
  if (!post) {
    throw new AppError(404, "Article not found.");
  }

  if (post.image?.public_id) {
    await deleteFromCloudinary(post.image.public_id);
  }

  await MediaPost.findByIdAndDelete(id);
  return { message: "Media post deleted successfully." };
};

export const MediaService = {
  createMediaPost,
  getAllMediaPosts,
  getMediaPostBySlug,
  getMediaPostById,
  updateMediaPost,
  deleteMediaPost,
};
