import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // If request body was sent as form-data containing JSON string in 'data' field, parse it
    if (req.body && typeof req.body.data === "string") {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (err) {
        // keep as is if not valid JSON
      }
    }

    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
      query: req.query,
      params: req.params,
    });
    next();
  });
};
