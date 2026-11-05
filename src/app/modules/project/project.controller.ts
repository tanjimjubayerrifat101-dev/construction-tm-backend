import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProjectService } from "./project.service";

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

const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.createProject(req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const lang = getRequestedLanguage(req);
  const result = await ProjectService.getAllProjects(req.query, lang);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getProjectByProjectId = catchAsync(async (req: Request, res: Response) => {
  const lang = getRequestedLanguage(req);
  const result = await ProjectService.getProjectByProjectId(req.params.projectId, lang);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project details retrieved successfully",
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getProjectById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully for editing",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.updateProject(
    req.params.id,
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.deleteProject(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const getPresenceMapData = catchAsync(async (req: Request, res: Response) => {
  const lang = getRequestedLanguage(req);
  const result = await ProjectService.getPresenceMapData(lang);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Presence map regional projects retrieved successfully",
    data: result,
  });
});

export const ProjectController = {
  createProject,
  getAllProjects,
  getProjectByProjectId,
  getProjectById,
  updateProject,
  deleteProject,
  getPresenceMapData,
};
