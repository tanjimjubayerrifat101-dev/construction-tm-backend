"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplication = exports.JobPosition = void 0;
const mongoose_1 = require("mongoose");
const localizedStringSchema = new mongoose_1.Schema({
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
}, { _id: false });
const localizedArraySchema = new mongoose_1.Schema({
    en: [{ type: String, trim: true }],
    ar: [{ type: String, trim: true }],
}, { _id: false });
const jobRequirementsSchema = new mongoose_1.Schema({
    education: {
        type: localizedArraySchema,
        default: { en: [], ar: [] },
    },
    experience: {
        type: localizedArraySchema,
        default: { en: [], ar: [] },
    },
    licensing: {
        type: localizedArraySchema,
        default: { en: [], ar: [] },
    },
}, { _id: false });
const jobPositionSchema = new mongoose_1.Schema({
    jobId: {
        type: String,
        required: [true, "Job identifier / slug is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    title: {
        type: localizedStringSchema,
        required: [true, "Job title is required"],
    },
    departmentId: {
        type: String,
        enum: [
            "systems-integration",
            "construction",
            "facility-services",
            "environmental",
            "manpower",
        ],
        required: [true, "Department ID is required"],
    },
    department: {
        type: localizedStringSchema,
        required: [true, "Department name is required"],
    },
    location: {
        type: localizedStringSchema,
        required: [true, "Job location is required"],
    },
    type: {
        type: localizedStringSchema,
        required: [true, "Job employment type is required (e.g. Full-time)"],
    },
    experience: {
        type: localizedStringSchema,
        required: [true, "Experience level is required (e.g. 8+ years)"],
    },
    postedDate: {
        type: String,
        required: [true, "Posted date is required (YYYY-MM-DD)"],
        trim: true,
    },
    icon: {
        type: String,
        default: "Briefcase",
    },
    overview: {
        type: localizedStringSchema,
        required: [true, "Job Purpose / Overview is required"],
    },
    responsibilities: {
        type: localizedArraySchema,
        required: [true, "Key responsibilities array is required"],
        default: { en: [], ar: [] },
    },
    requirements: {
        type: jobRequirementsSchema,
        required: true,
        default: () => ({
            education: { en: [], ar: [] },
            experience: { en: [], ar: [] },
            licensing: { en: [], ar: [] },
        }),
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
jobPositionSchema.index({ departmentId: 1 });
jobPositionSchema.index({ isActive: 1 });
jobPositionSchema.index({ order: 1 });
exports.JobPosition = (0, mongoose_1.model)("JobPosition", jobPositionSchema);
// Application Schema
const jobApplicationSchema = new mongoose_1.Schema({
    jobId: {
        type: String,
        required: [true, "Job position ID is required"],
        trim: true,
    },
    jobTitle: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
    },
    fullName: {
        type: String,
        required: [true, "Applicant full name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Applicant email is required"],
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    nationality: {
        type: String,
        required: [true, "Nationality is required"],
        trim: true,
    },
    currentCity: {
        type: String,
        required: [true, "Current city of residence is required"],
        trim: true,
    },
    experience: {
        type: String,
        required: [true, "Years of experience is required"],
    },
    noticePeriod: {
        type: String,
        required: [true, "Notice period is required"],
    },
    currentEmployer: {
        type: String,
        trim: true,
        default: "",
    },
    linkedin: {
        type: String,
        trim: true,
        default: "",
    },
    coverNote: {
        type: String,
        trim: true,
        default: "",
    },
    cv: {
        url: { type: String, required: true },
        public_id: { type: String, default: "" },
        filename: { type: String, default: "Resume" },
    },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
        default: "Pending",
    },
}, {
    timestamps: true,
});
jobApplicationSchema.index({ jobId: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ createdAt: -1 });
exports.JobApplication = (0, mongoose_1.model)("JobApplication", jobApplicationSchema);
