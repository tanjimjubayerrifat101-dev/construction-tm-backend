import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import fs from "fs";
import multer from "multer";
import path from "path";
import config from "../config";
import { AppError } from "../errors/AppError";



cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// Configure Multer with memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError(400, "Only image files (jpeg, png, webp, svg) are allowed!"));
    }
  },
});

export interface ICloudinaryUploadResult {
  url: string;
  public_id: string;
}

const uploadBufferToCloudinary = async (
  fileBuffer: Buffer,
  options: {
    folder: string;
    resource_type: "image" | "auto";
    public_id?: string;
  }
): Promise<ICloudinaryUploadResult> => {
  if (!config.cloudinary.cloud_name || !config.cloudinary.api_key || !config.cloudinary.api_secret) {
    throw new AppError(
      500,
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  try {
    const result = await new Promise<ICloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      uploadStream.end(fileBuffer);
    });

    return result;
  } catch (error) {
    const cloudinaryError =
      error && typeof error === "object" ? error : {};
    const message =
      "message" in cloudinaryError && typeof cloudinaryError.message === "string"
        ? cloudinaryError.message
        : "Unknown Cloudinary error";
    const httpCode =
      "http_code" in cloudinaryError && typeof cloudinaryError.http_code === "number"
        ? cloudinaryError.http_code
        : undefined;
    const requestId =
      "request_id" in cloudinaryError &&
      typeof cloudinaryError.request_id === "string"
        ? cloudinaryError.request_id
        : undefined;

    console.error("Cloudinary upload failed:", {
      message,
      httpCode,
      requestId,
    });
    const userMessage =
      httpCode === 403
        ? "Cloudinary denied this upload (403 Forbidden). Verify the account is active and the API key has upload access to this cloud."
        : `Cloudinary upload failed${httpCode ? ` (HTTP ${httpCode})` : ""}: ${message}`;
    throw new AppError(
      502,
      userMessage
    );
  }
};

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder = "tmyazna"
): Promise<ICloudinaryUploadResult> =>
  uploadBufferToCloudinary(fileBuffer, {
    folder,
    resource_type: "image",
  });

export const uploadDoc = multer({
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
    } else {
      cb(
        new AppError(
          400,
          "Only PDF, DOC, DOCX, and image files are allowed for CV submission."
        )
      );
    }
  },
});

export const uploadRawToCloudinary = async (
  fileBuffer: Buffer,
  folder = "tmyazna/resumes",
  originalName?: string
): Promise<ICloudinaryUploadResult> =>
  uploadBufferToCloudinary(fileBuffer, {
    folder,
    resource_type: "auto",
    public_id: originalName
      ? `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`
      : undefined,
  });

/**
 * Delete image or raw file from Cloudinary by public_id or local disk
 */
export const deleteFromCloudinary = async (public_id: string): Promise<void> => {
  if (!public_id) return;
  if (public_id.startsWith("local:")) {
    const relativePath = public_id.replace("local:", "");
    const localPath = path.join(process.cwd(), "uploads", relativePath);
    try {
      if (fs.existsSync(localPath)) {
        await fs.promises.unlink(localPath);
      }
    } catch (error) {
      console.warn("Local file deletion failed:", error);
    }
    return;
  }

  if (!config.cloudinary.cloud_name) return;
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
  }
};
