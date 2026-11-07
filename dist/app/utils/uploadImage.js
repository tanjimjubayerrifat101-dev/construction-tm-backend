"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadRawToCloudinary = exports.uploadDoc = exports.uploadToCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
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
const uploadBufferToCloudinary = async (fileBuffer, options) => {
    if (!config_1.default.cloudinary.cloud_name || !config_1.default.cloudinary.api_key || !config_1.default.cloudinary.api_secret) {
        throw new AppError_1.AppError(500, "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
    }
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream(options, (error, result) => {
                if (error || !result) {
                    return reject(error || new Error("Cloudinary upload failed"));
                }
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            });
            uploadStream.end(fileBuffer);
        });
        return result;
    }
    catch (error) {
        const cloudinaryError = error && typeof error === "object" ? error : {};
        const message = "message" in cloudinaryError && typeof cloudinaryError.message === "string"
            ? cloudinaryError.message
            : "Unknown Cloudinary error";
        const httpCode = "http_code" in cloudinaryError && typeof cloudinaryError.http_code === "number"
            ? cloudinaryError.http_code
            : undefined;
        const requestId = "request_id" in cloudinaryError &&
            typeof cloudinaryError.request_id === "string"
            ? cloudinaryError.request_id
            : undefined;
        console.error("Cloudinary upload failed:", {
            message,
            httpCode,
            requestId,
        });
        const userMessage = httpCode === 403
            ? "Cloudinary denied this upload (403 Forbidden). Verify the account is active and the API key has upload access to this cloud."
            : `Cloudinary upload failed${httpCode ? ` (HTTP ${httpCode})` : ""}: ${message}`;
        throw new AppError_1.AppError(502, userMessage);
    }
};
const uploadToCloudinary = async (fileBuffer, folder = "tmyazna") => uploadBufferToCloudinary(fileBuffer, {
    folder,
    resource_type: "image",
});
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
const uploadRawToCloudinary = async (fileBuffer, folder = "tmyazna/resumes", originalName) => uploadBufferToCloudinary(fileBuffer, {
    folder,
    resource_type: "auto",
    public_id: originalName
        ? `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`
        : undefined,
});
exports.uploadRawToCloudinary = uploadRawToCloudinary;
/**
 * Delete image or raw file from Cloudinary by public_id or local disk
 */
const deleteFromCloudinary = async (public_id) => {
    if (!public_id)
        return;
    if (public_id.startsWith("local:")) {
        const relativePath = public_id.replace("local:", "");
        const localPath = path_1.default.join(process.cwd(), "uploads", relativePath);
        try {
            if (fs_1.default.existsSync(localPath)) {
                await fs_1.default.promises.unlink(localPath);
            }
        }
        catch (error) {
            console.warn("Local file deletion failed:", error);
        }
        return;
    }
    if (!config_1.default.cloudinary.cloud_name)
        return;
    try {
        await cloudinary_1.v2.uploader.destroy(public_id);
    }
    catch (error) {
        console.error("Cloudinary deletion failed:", error);
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
