import { Response } from "express";

export interface TMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
}

export interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta;
  data: T;
}

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  return res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};
