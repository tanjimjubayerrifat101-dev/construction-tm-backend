"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = exports.formatLocalizedMediaPost = void 0;
const AppError_1 = require("../../errors/AppError");
const uploadImage_1 = require("../../utils/uploadImage");
const media_model_1 = require("./media.model");
const formatLocalizedMediaPost = (post, lang) => {
    if (!lang || (lang !== "en" && lang !== "ar")) {
        return post;
    }
    const isAr = lang === "ar";
    const selectStr = (field) => {
        if (!field)
            return "";
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
exports.formatLocalizedMediaPost = formatLocalizedMediaPost;
const createMediaPost = async (payload, file) => {
    const existing = await media_model_1.MediaPost.findOne({ slug: payload.slug });
    if (existing) {
        throw new AppError_1.AppError(400, `Article with slug '${payload.slug}' already exists.`);
    }
    if (file) {
        const uploadResult = await (0, uploadImage_1.uploadToCloudinary)(file.buffer, "tmyazna/media");
        payload.image = {
            url: uploadResult.url,
            public_id: uploadResult.public_id,
        };
    }
    else if (!payload.image?.url) {
        throw new AppError_1.AppError(400, "Media cover image is required.");
    }
    const post = await media_model_1.MediaPost.create(payload);
    return post;
};
const getAllMediaPosts = async (query, lang) => {
    const filter = {};
    if (query.isPublished !== undefined) {
        filter.isPublished = query.isPublished === "true";
    }
    if (query.category) {
        const categoryRegex = new RegExp(query.category, "i");
        filter.$or = [
            { "category.en": categoryRegex },
            { "category.ar": categoryRegex },
        ];
    }
    if (query.searchTerm) {
        const searchRegex = new RegExp(query.searchTerm, "i");
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
    const total = await media_model_1.MediaPost.countDocuments(filter);
    const posts = await media_model_1.MediaPost.find(filter)
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
        data: posts.map((p) => (0, exports.formatLocalizedMediaPost)(p, lang)),
    };
};
const getMediaPostBySlug = async (slug, lang) => {
    const post = await media_model_1.MediaPost.findOne({ slug, isPublished: true });
    if (!post) {
        throw new AppError_1.AppError(404, `Media article with slug '${slug}' not found.`);
    }
    return (0, exports.formatLocalizedMediaPost)(post, lang);
};
const getMediaPostById = async (id) => {
    const post = await media_model_1.MediaPost.findById(id);
    if (!post) {
        throw new AppError_1.AppError(404, "Article not found.");
    }
    return post;
};
const updateMediaPost = async (id, payload, file) => {
    const post = await media_model_1.MediaPost.findById(id);
    if (!post) {
        throw new AppError_1.AppError(404, "Article not found.");
    }
    if (payload.slug && payload.slug !== post.slug) {
        const existing = await media_model_1.MediaPost.findOne({ slug: payload.slug });
        if (existing) {
            throw new AppError_1.AppError(400, `Article with slug '${payload.slug}' already exists.`);
        }
    }
    if (file) {
        const uploadResult = await (0, uploadImage_1.uploadToCloudinary)(file.buffer, "tmyazna/media");
        payload.image = {
            url: uploadResult.url,
            public_id: uploadResult.public_id,
        };
        if (post.image?.public_id) {
            await (0, uploadImage_1.deleteFromCloudinary)(post.image.public_id);
        }
    }
    const updated = await media_model_1.MediaPost.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    return updated;
};
const deleteMediaPost = async (id) => {
    const post = await media_model_1.MediaPost.findById(id);
    if (!post) {
        throw new AppError_1.AppError(404, "Article not found.");
    }
    if (post.image?.public_id) {
        await (0, uploadImage_1.deleteFromCloudinary)(post.image.public_id);
    }
    await media_model_1.MediaPost.findByIdAndDelete(id);
    return { message: "Media post deleted successfully." };
};
exports.MediaService = {
    createMediaPost,
    getAllMediaPosts,
    getMediaPostBySlug,
    getMediaPostById,
    updateMediaPost,
    deleteMediaPost,
};
