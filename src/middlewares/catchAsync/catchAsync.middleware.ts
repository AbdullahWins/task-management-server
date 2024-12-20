//src/middlewares/catchAsync/catchAsync.middleware.ts
import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync =
  (fn: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
