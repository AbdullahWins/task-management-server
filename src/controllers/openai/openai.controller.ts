// src/controllers/summary.controller.ts
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../middlewares";
import { ENUM_ADMIN_ROLES, sendResponse, staticProps } from "../../utils";
import {
  ApiError,
  generatePlanToFinish,
  generateSummary,
} from "../../services";
import { isValidObjectId } from "mongoose";
import { Task } from "../../models";
import { IUser } from "../../interfaces";

export const createSummaryByTaskId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const authUser = req.user as IUser;

    //validate ID format
    if (!isValidObjectId(taskId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const task = await Task.findById(taskId);

    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    //check if the authenticated user is an admin
    const isAdmin =
      authUser.role &&
      Object.values(ENUM_ADMIN_ROLES).includes(
        authUser.role as ENUM_ADMIN_ROLES
      );

    //if not an admin, ensure the user is trying to access their own data
    if (!isAdmin && task?.userId.toString() !== authUser._id.toString()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.CAN_NOT_RETRIVE_OTHERS_DATA
      );
    }

    const summary = await generateSummary(task);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.openai.SUMMARY_GENERATED,
      data: { summary },
    });
  }
);

//plan to finish task
export const createPlanToFinishByTaskId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const authUser = req.user as IUser;

    //validate ID format
    if (!isValidObjectId(taskId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const task = await Task.findById(taskId);

    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    //check if the authenticated user is an admin
    const isAdmin =
      authUser.role &&
      Object.values(ENUM_ADMIN_ROLES).includes(
        authUser.role as ENUM_ADMIN_ROLES
      );

    //if not an admin, ensure the user is trying to access their own data
    if (!isAdmin && task?.userId.toString() !== authUser._id.toString()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.CAN_NOT_RETRIVE_OTHERS_DATA
      );
    }

    const planToFinish = await generatePlanToFinish(task);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.openai.PLAN_GENERATED,
      data: { planToFinish },
    });
  }
);
