"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const localizedStringSchema = new mongoose_1.Schema({
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
}, { _id: false });
const optionalLocalizedStringSchema = new mongoose_1.Schema({
    en: { type: String, trim: true, default: "" },
    ar: { type: String, trim: true, default: "" },
}, { _id: false });
const localizedArraySchema = new mongoose_1.Schema({
    en: [{ type: String, trim: true }],
    ar: [{ type: String, trim: true }],
}, { _id: false });
const serviceImageSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    public_id: { type: String, default: "" },
}, { _id: false });
const subDisciplineSchema = new mongoose_1.Schema({
    id: { type: String, required: true, trim: true },
    tabTitle: { type: localizedStringSchema, required: true },
    heading: { type: localizedStringSchema, required: true },
    description: { type: localizedStringSchema, required: true },
    capabilitiesHeading: { type: optionalLocalizedStringSchema },
    capabilities: { type: localizedArraySchema, default: { en: [], ar: [] } },
    icon: { type: String, default: "Settings" },
}, { _id: false });
const catalogItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true, trim: true },
    title: { type: localizedStringSchema, required: true },
    description: { type: localizedStringSchema, required: true },
    image: { type: serviceImageSchema, required: true },
    badge: { type: optionalLocalizedStringSchema },
}, { _id: false });
const serviceSchema = new mongoose_1.Schema({
    slug: {
        type: String,
        required: [true, "Service slug is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    number: {
        type: String,
        required: [true, "Service number is required (e.g. 01)"],
        trim: true,
    },
    name: {
        type: localizedStringSchema,
        required: [true, "Service name (en and ar) is required"],
    },
    shortTitle: {
        type: localizedStringSchema,
        required: [true, "Short title (en and ar) is required"],
    },
    heading: {
        type: localizedStringSchema,
        required: [true, "Heading (en and ar) is required"],
    },
    description: {
        type: localizedStringSchema,
        required: [true, "Description (en and ar) is required"],
    },
    image: {
        type: serviceImageSchema,
        required: [true, "Service hero image is required"],
    },
    icon: {
        type: String,
        required: [true, "Service icon identifier is required"],
        default: "Cpu",
    },
    tabHeading: {
        type: optionalLocalizedStringSchema,
    },
    coreCapabilitiesHeading: {
        type: optionalLocalizedStringSchema,
    },
    coreDescription: {
        type: optionalLocalizedStringSchema,
    },
    coreCapabilities: {
        type: localizedArraySchema,
        default: { en: [], ar: [] },
    },
    catalogHeading: {
        type: optionalLocalizedStringSchema,
    },
    subDisciplines: {
        type: [subDisciplineSchema],
        default: [],
    },
    catalogItems: {
        type: [catalogItemSchema],
        default: [],
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
serviceSchema.index({ order: 1 });
serviceSchema.index({ isActive: 1 });
exports.Service = (0, mongoose_1.model)("Service", serviceSchema);
