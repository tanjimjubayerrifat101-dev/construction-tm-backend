import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { MediaService } from "./media.service";

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

const createMediaPost = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.createMediaPost(req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Media article created successfully",
    data: result,
  });
});

const getAllMediaPosts = catchAsync(async (req: Request, res: Response) => {
  const lang = getRequestedLanguage(req);
  const result = await MediaService.getAllMediaPosts(req.query, lang);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media articles retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMediaPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const lang = getRequestedLanguage(req);
  const result = await MediaService.getMediaPostBySlug(req.params.slug, lang);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media article details retrieved successfully",
    data: result,
  });
});

const getMediaPostById = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.getMediaPostById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media article retrieved successfully for editing",
    data: result,
  });
});

const updateMediaPost = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.updateMediaPost(
    req.params.id,
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media article updated successfully",
    data: result,
  });
});

const deleteMediaPost = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.deleteMediaPost(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const MediaController = {
  createMediaPost,
  getAllMediaPosts,
  getMediaPostBySlug,
  getMediaPostById,
  updateMediaPost,
  deleteMediaPost,
};
