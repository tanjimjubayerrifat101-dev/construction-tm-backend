import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ServiceService } from "./service.service";

const getRequestedLanguage = (req: Request): string | undefined => {
  if (req.query.lang) {
    return req.query.lang as string;
  }
  const acceptLang = req.headers["accept-language"];
  if (acceptLang && acceptLang.toLowerCase().includes("ar")) {
    return "ar";
  }
  return undefined;
};

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.createService(req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const lang = getRequestedLanguage(req);
  const result = await ServiceService.getAllServices(req.query, lang);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getServiceBySlug = catchAsync(async (req: Request, res: Response) => {
  const lang = getRequestedLanguage(req);
  const result = await ServiceService.getServiceBySlug(req.params.slug, lang);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service details retrieved successfully",
    data: result,
  });
});

const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getServiceById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieved successfully for editing",
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.updateService(
    req.params.id,
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service updated successfully",
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.deleteService(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const addSubDiscipline = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.addSubDiscipline(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sub-discipline added successfully",
    data: result,
  });
});

const updateSubDiscipline = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.updateSubDiscipline(
    req.params.id,
    req.params.subId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub-discipline updated successfully",
    data: result,
  });
});

const deleteSubDiscipline = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.deleteSubDiscipline(
    req.params.id,
    req.params.subId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub-discipline removed successfully",
    data: result,
  });
});

const addCatalogItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.addCatalogItem(
    req.params.id,
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Catalog item added successfully",
    data: result,
  });
});

const updateCatalogItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.updateCatalogItem(
    req.params.id,
    req.params.catalogId,
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Catalog item updated successfully",
    data: result,
  });
});

const deleteCatalogItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.deleteCatalogItem(
    req.params.id,
    req.params.catalogId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Catalog item removed successfully",
    data: result,
  });
});

export const ServiceController = {
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
