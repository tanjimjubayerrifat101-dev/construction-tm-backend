import { AppError } from "../../errors/AppError";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/uploadImage";
import {
  ICatalogItem,
  IService,
  ISubDiscipline,
} from "./service.interface";
import { Service } from "./service.model";

// Helper to localize a single service document if requested
export const formatLocalizedService = (
  service: IService,
  lang?: "en" | "ar" | string
) => {
  if (!lang || (lang !== "en" && lang !== "ar")) {
    return service;
  }

  const isAr = lang === "ar";
  const selectStr = (field?: { en: string; ar: string }) => {
    if (!field) return "";
    return isAr ? field.ar || field.en : field.en || field.ar;
  };

  const selectArr = (field?: { en: string[]; ar: string[] }) => {
    if (!field) return [];
    return isAr ? (field.ar?.length ? field.ar : field.en) : field.en?.length ? field.en : field.ar;
  };

  return {
    _id: service._id,
    id: service.slug,
    slug: service.slug,
    number: service.number,
    name: selectStr(service.name),
    shortTitle: selectStr(service.shortTitle),
    heading: selectStr(service.heading),
    description: selectStr(service.description),
    image: service.image,
    icon: service.icon,
    tabHeading: selectStr(service.tabHeading),
    coreCapabilitiesHeading: selectStr(service.coreCapabilitiesHeading),
    coreDescription: selectStr(service.coreDescription),
    coreCapabilities: selectArr(service.coreCapabilities),
    catalogHeading: selectStr(service.catalogHeading),
    order: service.order,
    isActive: service.isActive,
    subDisciplines: service.subDisciplines?.map((sub) => ({
      id: sub.id,
      tabTitle: selectStr(sub.tabTitle),
      heading: selectStr(sub.heading),
      description: selectStr(sub.description),
      capabilitiesHeading: selectStr(sub.capabilitiesHeading),
      capabilities: selectArr(sub.capabilities),
      icon: sub.icon,
    })),
    catalogItems: service.catalogItems?.map((cat) => ({
      id: cat.id,
      title: selectStr(cat.title),
      description: selectStr(cat.description),
      image: cat.image,
      badge: selectStr(cat.badge),
    })),
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

const createService = async (
  payload: Partial<IService>,
  file?: Express.Multer.File
) => {
  const existingService = await Service.findOne({ slug: payload.slug });
  if (existingService) {
    throw new AppError(400, `A service with slug '${payload.slug}' already exists.`);
  }

  // Handle hero image upload to Cloudinary if file attached
  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, "tmyazna/services");
    payload.image = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
  } else if (!payload.image || !payload.image.url) {
    throw new AppError(400, "Service image is required. Provide image URL or upload a file.");
  }

  const service = await Service.create(payload);
  return service;
};

const getAllServices = async (
  query: Record<string, unknown>,
  lang?: string
) => {
  const filter: Record<string, unknown> = {};

  // For public website, only return active services unless specified
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  // Keyword search
  if (query.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm as string, "i");
    filter.$or = [
      { slug: searchRegex },
      { "name.en": searchRegex },
      { "name.ar": searchRegex },
      { "shortTitle.en": searchRegex },
      { "shortTitle.ar": searchRegex },
      { "description.en": searchRegex },
      { "description.ar": searchRegex },
    ];
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await Service.countDocuments(filter);
  const services = await Service.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const formattedServices = services.map((s) =>
    formatLocalizedService(s, lang)
  );

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: formattedServices,
  };
};

const getServiceBySlug = async (slug: string, lang?: string) => {
  const service = await Service.findOne({ slug, isActive: true });
  if (!service) {
    throw new AppError(404, `Service with slug '${slug}' not found.`);
  }

  return formatLocalizedService(service, lang);
};

const getServiceById = async (id: string) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new AppError(404, "Service not found.");
  }
  return service;
};

const updateService = async (
  id: string,
  payload: Partial<IService>,
  file?: Express.Multer.File
) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new AppError(404, "Service not found.");
  }

  // If slug changed, verify uniqueness
  if (payload.slug && payload.slug !== service.slug) {
    const existing = await Service.findOne({ slug: payload.slug });
    if (existing) {
      throw new AppError(400, `A service with slug '${payload.slug}' already exists.`);
    }
  }

  // Upload new image if file provided
  if (file) {
    if (service.image?.public_id) {
      await deleteFromCloudinary(service.image.public_id);
    }
    const uploadResult = await uploadToCloudinary(file.buffer, "tmyazna/services");
    payload.image = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
  }

  const updatedService = await Service.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return updatedService;
};

const deleteService = async (id: string) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new AppError(404, "Service not found.");
  }

  // Delete hero image from Cloudinary
  if (service.image?.public_id) {
    await deleteFromCloudinary(service.image.public_id);
  }

  // Delete all catalog images from Cloudinary
  if (service.catalogItems && service.catalogItems.length > 0) {
    for (const item of service.catalogItems) {
      if (item.image?.public_id) {
        await deleteFromCloudinary(item.image.public_id);
      }
    }
  }

  await Service.findByIdAndDelete(id);
  return { message: "Service and associated media deleted successfully" };
};

// Sub-Discipline (Tabs) Management
const addSubDiscipline = async (
  serviceId: string,
  payload: ISubDiscipline
) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(404, "Service not found.");
  }

  const isDuplicate = service.subDisciplines.some((s) => s.id === payload.id);
  if (isDuplicate) {
    throw new AppError(400, `Sub-discipline with ID '${payload.id}' already exists in this service.`);
  }

  service.subDisciplines.push(payload);
  await service.save();

  return service;
};

const updateSubDiscipline = async (
  serviceId: string,
  subId: string,
  payload: Partial<ISubDiscipline>
) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(404, "Service not found.");
  }

  const subIndex = service.subDisciplines.findIndex((s) => s.id === subId);
  if (subIndex === -1) {
    throw new AppError(404, `Sub-discipline '${subId}' not found.`);
  }

  service.subDisciplines[subIndex] = {
    ...service.subDisciplines[subIndex],
    ...payload,
  };

  await service.save();
  return service;
};

const deleteSubDiscipline = async (serviceId: string, subId: string) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(404, "Service not found.");
  }

  service.subDisciplines = service.subDisciplines.filter((s) => s.id !== subId);
  await service.save();

  return service;
};

// Catalog Items Management
const addCatalogItem = async (
  serviceId: string,
  payload: Partial<ICatalogItem>,
  file?: Express.Multer.File
) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(404, "Service not found.");
  }

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, "tmyazna/catalog");
    payload.image = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
  } else if (!payload.image?.url) {
    throw new AppError(400, "Catalog item image is required.");
  }

  if (!payload.id) {
    payload.id = `cat-${Date.now()}`;
  }

  service.catalogItems.push(payload as ICatalogItem);
  await service.save();

  return service;
};

const updateCatalogItem = async (
  serviceId: string,
  catalogId: string,
  payload: Partial<ICatalogItem>,
  file?: Express.Multer.File
) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(404, "Service not found.");
  }

  const catIndex = service.catalogItems.findIndex((c) => c.id === catalogId);
  if (catIndex === -1) {
    throw new AppError(404, `Catalog item '${catalogId}' not found.`);
  }

  if (file) {
    if (service.catalogItems[catIndex].image?.public_id) {
      await deleteFromCloudinary(service.catalogItems[catIndex].image.public_id);
    }
    const uploadResult = await uploadToCloudinary(file.buffer, "tmyazna/catalog");
    payload.image = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
  }

  service.catalogItems[catIndex] = {
    ...service.catalogItems[catIndex],
    ...payload,
  };

  await service.save();
  return service;
};

const deleteCatalogItem = async (serviceId: string, catalogId: string) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(404, "Service not found.");
  }

  const itemToDelete = service.catalogItems.find((c) => c.id === catalogId);
  if (itemToDelete?.image?.public_id) {
    await deleteFromCloudinary(itemToDelete.image.public_id);
  }

  service.catalogItems = service.catalogItems.filter((c) => c.id !== catalogId);
  await service.save();

  return service;
};

export const ServiceService = {
  createService,
  getAllServices,
  getServiceBySlug,
  getServiceById,
  updateService,
  deleteService,
  addSubDiscipline,
  updateSubDiscipline,
  deleteSubDiscipline,
  addCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
};
