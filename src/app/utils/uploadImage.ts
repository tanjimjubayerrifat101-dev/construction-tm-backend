import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
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

/**
 * Fallback to local file system storage when Cloudinary is unavailable or restricted
 */
const saveToLocalStorage = async (
  fileBuffer: Buffer,
  folder = "tmyazna",
  originalName?: string
): Promise<ICloudinaryUploadResult> => {
  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, "");
  const targetDir = path.join(process.cwd(), "uploads", sanitizedFolder);
  await fs.promises.mkdir(targetDir, { recursive: true });

  const ext = originalName ? path.extname(originalName) || ".png" : ".png";
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const targetFilePath = path.join(targetDir, uniqueName);

  await fs.promises.writeFile(targetFilePath, fileBuffer);

  const baseUrl = config.server_base_url || `http://localhost:${config.port}`;
  const fileUrl = `${baseUrl}/uploads/${sanitizedFolder}/${uniqueName}`;

  return {
    url: fileUrl,
    public_id: `local:${sanitizedFolder}/${uniqueName}`,
  };
};

/**
 * Upload buffer directly to Cloudinary with automatic fallback to local disk
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder = "tmyazna"
): Promise<ICloudinaryUploadResult> => {
  if (!config.cloudinary.cloud_name || !config.cloudinary.api_key || !config.cloudinary.api_secret) {
    console.warn("⚠️ Cloudinary not fully configured. Saving image locally...");
    return saveToLocalStorage(fileBuffer, folder);
  }

  try {
    const result = await new Promise<ICloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result: UploadApiResponse | undefined) => {
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
  } catch (error: any) {
    console.warn(
      `⚠️ Cloudinary upload failed (${error?.message || "unknown error"}). Gracefully falling back to local storage...`
    );
    return saveToLocalStorage(fileBuffer, folder);
  }
};

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
): Promise<ICloudinaryUploadResult> => {
  if (!config.cloudinary.cloud_name || !config.cloudinary.api_key || !config.cloudinary.api_secret) {
    console.warn("⚠️ Cloudinary not fully configured. Storing raw file locally...");
    return saveToLocalStorage(fileBuffer, folder, originalName);
  }

  try {
    const result = await new Promise<ICloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: originalName
            ? `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`
            : undefined,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(error || new Error("File upload failed"));
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
  } catch (error: any) {
    console.warn(
      `⚠️ Cloudinary raw upload failed (${error?.message || "unknown error"}). Gracefully falling back to local storage...`
    );
    return saveToLocalStorage(fileBuffer, folder, originalName);
  }
};

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

