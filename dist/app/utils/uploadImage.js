"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadRawToCloudinary = exports.uploadDoc = exports.uploadToCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = require("../errors/AppError");
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret,
});
// Configure Multer with memory storage
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new AppError_1.AppError(400, "Only image files (jpeg, png, webp, svg) are allowed!"));
        }
    },
});
/**
 * Upload buffer directly to Cloudinary
 */
const uploadToCloudinary = (fileBuffer, folder = "tmyazna") => {
    return new Promise((resolve, reject) => {
        // If cloudinary credentials are not yet set in .env, reject gracefully or handle
        if (!config_1.default.cloudinary.cloud_name || !config_1.default.cloudinary.api_key) {
            return reject(new AppError_1.AppError(500, "Cloudinary credentials not configured in backend environment variables (.env)."));
        }
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: "image",
        }, (error, result) => {
            if (error || !result) {
                return reject(new AppError_1.AppError(500, error?.message || "Cloudinary upload failed"));
            }
            resolve({
                url: result.secure_url,
                public_id: result.public_id,
            });
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
exports.uploadDoc = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png",
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new AppError_1.AppError(400, "Only PDF, DOC, DOCX, and image files are allowed for CV submission."));
        }
    },
});
const uploadRawToCloudinary = (fileBuffer, folder = "tmyazna/resumes", originalName) => {
    return new Promise((resolve, reject) => {
        if (!config_1.default.cloudinary.cloud_name || !config_1.default.cloudinary.api_key) {
            return reject(new AppError_1.AppError(500, "Cloudinary credentials not configured in backend environment variables (.env)."));
        }
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: "auto",
            public_id: originalName
                ? `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`
                : undefined,
        }, (error, result) => {
            if (error || !result) {
                return reject(new AppError_1.AppError(500, error?.message || "File upload failed"));
            }
            resolve({
                url: result.secure_url,
                public_id: result.public_id,
            });
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadRawToCloudinary = uploadRawToCloudinary;
/**
 * Delete image or raw file from Cloudinary by public_id
 */
const deleteFromCloudinary = async (public_id) => {
    if (!public_id || !config_1.default.cloudinary.cloud_name)
        return;
    try {
        await cloudinary_1.v2.uploader.destroy(public_id);
    }
    catch (error) {
        console.error("Cloudinary deletion failed:", error);
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
