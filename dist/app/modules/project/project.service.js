"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = exports.formatLocalizedProject = exports.SAUDI_REGIONS_STATIC = void 0;
const AppError_1 = require("../../errors/AppError");
const uploadImage_1 = require("../../utils/uploadImage");
const project_model_1 = require("./project.model");
// Saudi Arabia standard 13 administrative regions
exports.SAUDI_REGIONS_STATIC = [
    { id: "riyadh", name: "Riyadh Region", nameAr: "منطقة الرياض", cityLabel: "Riyadh", cityLabelAr: "الرياض" },
    { id: "makkah", name: "Makkah Region", nameAr: "منطقة مكة المكرمة", cityLabel: "Jeddah · Makkah", cityLabelAr: "جدة · مكة المكرمة" },
    { id: "eastern-province", name: "Eastern Province", nameAr: "المنطقة الشرقية", cityLabel: "Dammam · Khobar · Jubail", cityLabelAr: "الدمام · الخبر · الجبيل" },
    { id: "madinah", name: "Madinah Region", nameAr: "منطقة المدينة المنورة", cityLabel: "Madinah · Yanbu", cityLabelAr: "المدينة المنورة · ينبع" },
    { id: "tabuk", name: "Tabuk Region", nameAr: "منطقة تبوك", cityLabel: "Tabuk · NEOM", cityLabelAr: "تبوك · نيوم" },
    { id: "al-qassim", name: "Al Qassim", nameAr: "منطقة القصيم", cityLabel: "Buraidah · Unaizah", cityLabelAr: "بريدة · عنيزة" },
    { id: "asir", name: "Asir Region", nameAr: "منطقة عسير", cityLabel: "Abha · Khamis Mushait", cityLabelAr: "أبها · خميس مشيط" },
    { id: "hail", name: "Hail Region", nameAr: "منطقة حائل", cityLabel: "Hail", cityLabelAr: "حائل" },
    { id: "northern-borders", name: "Northern Borders", nameAr: "منطقة الحدود الشمالية", cityLabel: "Arar · Turaif", cityLabelAr: "عرعر · طريف" },
    { id: "jazan", name: "Jazan Region", nameAr: "منطقة جازان", cityLabel: "Jazan", cityLabelAr: "جازان" },
    { id: "najran", name: "Najran Region", nameAr: "منطقة نجران", cityLabel: "Najran", cityLabelAr: "نجران" },
    { id: "al-bahah", name: "Al Bahah", nameAr: "منطقة الباحة", cityLabel: "Al Bahah", cityLabelAr: "الباحة" },
    { id: "al-jawf", name: "Al Jawf", nameAr: "منطقة الجوف", cityLabel: "Sakaka · Qurayyat", cityLabelAr: "سكاكا · القريات" },
];
const formatLocalizedProject = (project, lang) => {
    if (!lang || (lang !== "en" && lang !== "ar")) {
        return project;
    }
    const isAr = lang === "ar";
    const selectStr = (field) => {
        if (!field)
            return "";
        return isAr ? field.ar || field.en : field.en || field.ar;
    };
    return {
        _id: project._id,
        id: project.projectId,
        projectId: project.projectId,
        title: selectStr(project.title),
        sector: selectStr(project.sector),
        sectorSlug: project.sectorSlug,
        status: selectStr(project.status),
        statusText: selectStr(project.status),
        statusCode: project.statusCode,
        location: selectStr(project.location),
        regionId: project.regionId,
        description: selectStr(project.description),
        value: selectStr(project.value),
        year: project.year,
        progress: project.progress,
        image: project.image,
        isFlagship: project.isFlagship,
        order: project.order,
        isActive: project.isActive,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };
};
exports.formatLocalizedProject = formatLocalizedProject;
const createProject = async (payload, file) => {
    const existing = await project_model_1.Project.findOne({ projectId: payload.projectId });
    if (existing) {
        throw new AppError_1.AppError(400, `Project with ID '${payload.projectId}' already exists.`);
    }
    if (file) {
        const uploadResult = await (0, uploadImage_1.uploadToCloudinary)(file.buffer, "tmyazna/projects");
        payload.image = {
            url: uploadResult.url,
            public_id: uploadResult.public_id,
        };
    }
    else if (!payload.image?.url) {
        throw new AppError_1.AppError(400, "Project cover image is required.");
    }
    const project = await project_model_1.Project.create(payload);
    return project;
};
const getAllProjects = async (query, lang) => {
    const filter = {};
    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === "true";
    }
    if (query.sectorSlug && query.sectorSlug !== "all") {
        filter.sectorSlug = query.sectorSlug;
    }
    if (query.statusCode) {
        filter.statusCode = query.statusCode;
    }
    if (query.regionId) {
        filter.regionId = query.regionId.toLowerCase();
    }
    if (query.isFlagship !== undefined) {
        filter.isFlagship = query.isFlagship === "true";
    }
    if (query.searchTerm) {
        const searchRegex = new RegExp(query.searchTerm, "i");
        filter.$or = [
            { projectId: searchRegex },
            { "title.en": searchRegex },
            { "title.ar": searchRegex },
            { "location.en": searchRegex },
            { "location.ar": searchRegex },
            { "description.en": searchRegex },
            { "description.ar": searchRegex },
        ];
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const total = await project_model_1.Project.countDocuments(filter);
    const projects = await project_model_1.Project.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: projects.map((p) => (0, exports.formatLocalizedProject)(p, lang)),
    };
};
const getProjectById = async (id) => {
    const project = await project_model_1.Project.findById(id);
    if (!project) {
        throw new AppError_1.AppError(404, "Project not found.");
    }
    return project;
};
const getProjectByProjectId = async (projectId, lang) => {
    const project = await project_model_1.Project.findOne({ projectId, isActive: true });
    if (!project) {
        throw new AppError_1.AppError(404, `Project '${projectId}' not found.`);
    }
    return (0, exports.formatLocalizedProject)(project, lang);
};
const updateProject = async (id, payload, file) => {
    const project = await project_model_1.Project.findById(id);
    if (!project) {
        throw new AppError_1.AppError(404, "Project not found.");
    }
    if (payload.projectId && payload.projectId !== project.projectId) {
        const existing = await project_model_1.Project.findOne({ projectId: payload.projectId });
        if (existing) {
            throw new AppError_1.AppError(400, `Project with ID '${payload.projectId}' already exists.`);
        }
    }
    if (file) {
        const uploadResult = await (0, uploadImage_1.uploadToCloudinary)(file.buffer, "tmyazna/projects");
        payload.image = {
            url: uploadResult.url,
            public_id: uploadResult.public_id,
        };
        if (project.image?.public_id) {
            await (0, uploadImage_1.deleteFromCloudinary)(project.image.public_id);
        }
    }
    const updated = await project_model_1.Project.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    return updated;
};
const deleteProject = async (id) => {
    const project = await project_model_1.Project.findById(id);
    if (!project) {
        throw new AppError_1.AppError(404, "Project not found.");
    }
    if (project.image?.public_id) {
        await (0, uploadImage_1.deleteFromCloudinary)(project.image.public_id);
    }
    await project_model_1.Project.findByIdAndDelete(id);
    return { message: "Project deleted successfully." };
};
// Map Presence Aggregation for Saudi Arabia Presence Page
const getPresenceMapData = async (lang) => {
    const isAr = lang === "ar";
    const activeProjects = await project_model_1.Project.find({ isActive: true });
    const regionsWithProjects = exports.SAUDI_REGIONS_STATIC.map((region) => {
        const matchingProjects = activeProjects
            .filter((p) => p.regionId?.toLowerCase() === region.id.toLowerCase())
            .map((p) => (0, exports.formatLocalizedProject)(p, lang));
        return {
            id: region.id,
            name: isAr ? region.nameAr : region.name,
            cityLabel: isAr ? region.cityLabelAr : region.cityLabel,
            hasProjects: matchingProjects.length > 0,
            projectCount: matchingProjects.length,
            projects: matchingProjects,
        };
    });
    return regionsWithProjects;
};
exports.ProjectService = {
    createProject,
    getAllProjects,
    getProjectById,
    getProjectByProjectId,
    updateProject,
    deleteProject,
    getPresenceMapData,
};
