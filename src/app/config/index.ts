import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  server_base_url:
    process.env.SERVER_BASE_URL ||
    `http://localhost:${process.env.PORT || 5000}`,
  database_url: process.env.DATABASE_URL || "",
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS
    ? Number(process.env.BCRYPT_SALT_ROUNDS)
    : 12,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret_key_12345",
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "7d",
    refresh_secret: process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_key_12345",
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "TMYAZNA Support <no-reply@tmyazna.com>",
  },
  client_url:
    process.env.CLIENT_URL || "https://construction-tm.vercel.app/en",
  admin_url:
    process.env.ADMIN_URL || "https://construction-tm.vercel.app/en/admin",
  super_admin: {
    name: process.env.SUPER_ADMIN_NAME || "Admin",
    email: process.env.SUPER_ADMIN_EMAIL || "admin@tmyazna.com",
    password: process.env.SUPER_ADMIN_PASSWORD || "Admin@123456",
  },
};
