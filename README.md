# TMYAZNA Construction Backend API 🏗️

Production-ready, industry-standard Express + TypeScript + MongoDB + Zod REST API designed for the TMYAZNA Construction & Systems Integration Admin Dashboard and bilingual public web application.

---

## 🚀 Features

- **TypeScript + Modular Architecture**: Built with scalable separation of concerns (`modules/`, `config/`, `middlewares/`, `errors/`, `utils/`, `routes/`).
- **Bilingual Content (English & Arabic)**: Every public model supports `{ en, ar }` localization natively. The API can return full bilingual objects for admin management, or automatically deliver localized responses matching the client's language (`?lang=ar` or `?lang=en` or `Accept-Language` header).
- **Authentication & Admin Control**: Single-role admin security (`ADMIN`) with JWT access & refresh tokens, bcrypt password hashing, forgot-password email flows via SMTP, password change, and profile/avatar updates.
- **Services & Sub-Services (Tabs)**: Hierarchical service structures with integrated disciplines (sub-services/tabs) and catalog items with equipment specifications and badges.
- **Projects & Interactive Saudi Map Presence**: Full project management with sector categorization, status tracking, completion percentage, flagship flags, and direct region mapping (`/api/v1/projects/presence-map`) powering the interactive Saudi Arabia map.
- **Media Center (News & Insights)**: Article and blog management with categories, reading time, publication dates, and author information.
- **File Uploads via Cloudinary**: Images, service/catalog media, avatars, and career CVs are uploaded to Cloudinary; upload failures return an error instead of saving files locally.
- **Reusable Utilities**: Centralized `sendResponse`, `catchAsync`, `globalErrorHandler`, `validateRequest`, `uploadImage`, and `sendEmail`.

---

## 📁 Directory Structure

```text
backend/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   └── index.ts                 # Environment config loader
│   │   ├── errors/
│   │   │   ├── AppError.ts              # Custom operational error
│   │   │   ├── handleCastError.ts       # Mongoose Invalid ID handler
│   │   │   ├── handleDuplicateError.ts  # Mongo duplicate key handler
│   │   │   ├── handleValidationError.ts # Mongoose schema validation handler
│   │   │   └── handleZodError.ts        # Zod validation error handler
│   │   ├── middlewares/
│   │   │   ├── auth.ts                  # JWT Bearer token & Admin guard
│   │   │   ├── globalErrorHandler.ts    # Centralized error handler
│   │   │   ├── notFound.ts              # 404 Route handler
│   │   │   └── validateRequest.ts       # Zod schema validation middleware
│   │   ├── modules/
│   │   │   ├── auth/                    # Admin Auth & Profile module
│   │   │   ├── service/                 # Services & Sub-services (Tabs) module
│   │   │   ├── project/                 # Projects & Saudi Presence Map module
│   │   │   └── media/                   # Media Center (News & Insights) module
│   │   ├── routes/
│   │   │   └── index.ts                 # Central router mounted on /api/v1
│   │   ├── seed/
│   │   │   └── seed.ts                  # Database seeder script (Admin login only)
│   │   └── utils/
│   │       ├── catchAsync.ts            # Async wrapper for route handlers
│   │       ├── sendResponse.ts          # Standardized API response formatter
│   │       ├── sendEmail.ts             # Nodemailer SMTP with HTML templates
│   │       └── uploadImage.ts           # Multer + Cloudinary streaming
│   ├── app.ts                          # Express application configuration
│   └── server.ts                       # Server bootstrap & process lifecycle
├── .env.example
├── .env
├── package.json
└── tsconfig.json
```

---

## ⚙️ Environment Variables

Set your keys in `.env`:

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://<user>:<password>@cluster0.mongodb.net/tmyazna?retryWrites=true&w=majority

# JWT
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_SALT_ROUNDS=12

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="TMYAZNA Support <no-reply@tmyazna.com>"

# Client Origins
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000/admin

# Initial Admin Credentials (for seed script)
SUPER_ADMIN_NAME=Admin
SUPER_ADMIN_EMAIL=admin@tmyazna.com
SUPER_ADMIN_PASSWORD=AdminPassword@123
```

All three Cloudinary values are required for file uploads.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Admin login | No |
| `POST` | `/api/v1/auth/refresh-token` | Refresh expired access token | No |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset email | No |
| `POST` | `/api/v1/auth/reset-password` | Reset password using token | No |
| `GET` | `/api/v1/auth/me` | Get current logged-in admin profile | Yes (`ADMIN`) |
| `PATCH` | `/api/v1/auth/update-me` | Update name, phone, or avatar | Yes (`ADMIN`) |
| `POST` | `/api/v1/auth/change-password` | Change password | Yes (`ADMIN`) |

### 🛠️ Services (`/api/v1/services`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/services` | Get all active services (`?lang=en` or `?lang=ar`) | No |
| `GET` | `/api/v1/services/:slug` | Get single service by slug | No |
| `GET` | `/api/v1/services/admin/:id` | Get full bilingual service for editing | Yes (`ADMIN`) |
| `POST` | `/api/v1/services` | Create new service | Yes (`ADMIN`) |
| `PATCH` | `/api/v1/services/:id` | Update service details or hero image | Yes (`ADMIN`) |
| `DELETE` | `/api/v1/services/:id` | Delete service and images | Yes (`ADMIN`) |
| `POST` | `/api/v1/services/:id/sub-discipline` | Add sub-service / tab (e.g. Electrical, HVAC) | Yes (`ADMIN`) |
| `PATCH` | `/api/v1/services/:id/sub-discipline/:subId` | Update sub-service tab | Yes (`ADMIN`) |
| `DELETE` | `/api/v1/services/:id/sub-discipline/:subId` | Delete sub-service tab | Yes (`ADMIN`) |
| `POST` | `/api/v1/services/:id/catalog` | Add catalog item with image | Yes (`ADMIN`) |
| `PATCH` | `/api/v1/services/:id/catalog/:catalogId` | Update catalog item or image | Yes (`ADMIN`) |
| `DELETE` | `/api/v1/services/:id/catalog/:catalogId` | Remove catalog item from service | Yes (`ADMIN`) |

### 🏗️ Projects & Map Presence (`/api/v1/projects`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/projects` | Get all projects (`?sectorSlug=...&statusCode=...&regionId=...&lang=...`) | No |
| `GET` | `/api/v1/projects/presence-map` | Dynamic Saudi Arabia Map Presence data aggregated by region | No |
| `GET` | `/api/v1/projects/detail/:projectId` | Get project detail by project ID | No |
| `GET` | `/api/v1/projects/admin/:id` | Get full project for editing | Yes (`ADMIN`) |
| `POST` | `/api/v1/projects` | Create new project (with image upload) | Yes (`ADMIN`) |
| `PATCH` | `/api/v1/projects/:id` | Update project | Yes (`ADMIN`) |
| `DELETE` | `/api/v1/projects/:id` | Delete project and Cloudinary image | Yes (`ADMIN`) |

### 📰 Media Center (`/api/v1/media`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/media` | Get all published articles (`?category=...&searchTerm=...&lang=...`) | No |
| `GET` | `/api/v1/media/:slug` | Get single article by slug | No |
| `GET` | `/api/v1/media/admin/:id` | Get full article for editing | Yes (`ADMIN`) |
| `POST` | `/api/v1/media` | Create new article (with cover image) | Yes (`ADMIN`) |
| `PATCH` | `/api/v1/media/:id` | Update article | Yes (`ADMIN`) |
| `DELETE` | `/api/v1/media/:id` | Delete article and Cloudinary image | Yes (`ADMIN`) |

### 💼 Careers & Job Applications (`/api/v1/careers`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/careers` | Get all active job positions (`?departmentId=...&searchTerm=...&lang=...`) | No |
| `GET` | `/api/v1/careers/:jobId` | Get job position details by slug/jobId | No |
| `POST` | `/api/v1/careers/apply` | Public job application submission (with CV document upload) | No |
| `GET` | `/api/v1/careers/admin/:id` | Get full job position for editing | Yes (`ADMIN`) |
| `POST` | `/api/v1/careers` | Create new job position | Yes (`ADMIN`) |
| `PATCH` | `/api/v1/careers/:id` | Update job position | Yes (`ADMIN`) |
| `DELETE` | `/api/v1/careers/:id` | Delete job position | Yes (`ADMIN`) |
| `GET` | `/api/v1/careers/admin/applications/all` | Get all submitted job applications | Yes (`ADMIN`) |
| `PATCH` | `/api/v1/careers/admin/applications/:id/status` | Update applicant status (Shortlisted, Rejected, etc.) | Yes (`ADMIN`) |
| `DELETE` | `/api/v1/careers/admin/applications/:id` | Delete application and attached CV | Yes (`ADMIN`) |
