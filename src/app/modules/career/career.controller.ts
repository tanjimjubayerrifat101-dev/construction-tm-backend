import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CareerService } from "./career.service";

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

const createJobPosition = catchAsync(async (req: Request, res: Response) => {
  const result = await CareerService.createJobPosition(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job position created successfully",
    data: result,
  });
});

const getAllJobPositions = catchAsync(async (req: Request, res: Response) => {
  const lang = getRequestedLanguage(req);
  const result = await CareerService.getAllJobPositions(req.query, lang);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job positions retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getJobPositionByJobId = catchAsync(async (req: Request, res: Response) => {
  const lang = getRequestedLanguage(req);
  const result = await CareerService.getJobPositionByJobId(
    req.params.jobId,
    lang
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job position details retrieved successfully",
    data: result,
  });
});

const getJobPositionById = catchAsync(async (req: Request, res: Response) => {
  const result = await CareerService.getJobPositionById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job position retrieved successfully for editing",
    data: result,
  });
});

const updateJobPosition = catchAsync(async (req: Request, res: Response) => {
  const result = await CareerService.updateJobPosition(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job position updated successfully",
    data: result,
  });
});

const deleteJobPosition = catchAsync(async (req: Request, res: Response) => {
  const result = await CareerService.deleteJobPosition(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// Application Endpoints
const submitJobApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await CareerService.submitJobApplication(
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job application submitted successfully",
    data: result,
  });
});

const getAllJobApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await CareerService.getAllJobApplications(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job applications retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await CareerService.updateApplicationStatus(
    req.params.id,
    req.body.status
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application status updated successfully",
    data: result,
  });
});

const deleteJobApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await CareerService.deleteJobApplication(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const CareerController = {
  createJobPosition,
  getAllJobPositions,
  getJobPositionByJobId,
  getJobPositionById,
  updateJobPosition,
  deleteJobPosition,
  submitJobApplication,
  getAllJobApplications,
  updateApplicationStatus,
  deleteJobApplication,
};
