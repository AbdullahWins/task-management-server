// src/controllers/task/task.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { Task } from "../../models";
import {
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../utils";
import {
  TaskAddDtoZodSchema,
  TaskResponseDto,
  TaskUpdateDtoZodSchema,
} from "../../dtos";
import { ApiError, validateZodSchema } from "../../services";
import { ITaskAdd, ITaskUpdate, IUser } from "../../interfaces";
import { catchAsync } from "../../middlewares";

// get all tasks with pagination
export const GetAllTasks: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(Task.find(), { page, limit });

    const tasksFromDto = paginatedResult.data.map(
      (task) => new TaskResponseDto(task.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: tasksFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one task
export const GetTaskById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;

    // Validate ID format
    if (!isValidObjectId(taskId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const task = await Task.findById(taskId);

    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const taskFromDto = new TaskResponseDto(task);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: taskFromDto,
    });
  }
);

// create one task
export const AddOneTask: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Parsing data
    const parsedData = req.body;
    const authUser = req.user as IUser;

    const { title, description, dueDate } = parsedData as ITaskAdd;

    // validate data with zod schema
    validateZodSchema(TaskAddDtoZodSchema, parsedData);

    const constructedData = {
      userId: authUser._id,
      title,
      description,
      dueDate,
    };

    // Create new task
    const taskData = await Task.create(constructedData);

    if (!taskData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const taskFromDto = new TaskResponseDto(taskData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: taskFromDto,
    });
  }
);

// update one task
export const UpdateTaskById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { taskId } = req.params;
    const parsedData = req.body;

    //get parsed data
    const { title, description, dueDate } = parsedData as ITaskUpdate;

    if (!isValidObjectId(taskId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    //validate data with zod schema
    validateZodSchema(TaskUpdateDtoZodSchema, parsedData);

    // Check if a task exists or not
    const existsTask = await Task.findById(taskId);
    if (!existsTask)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);

    //construct data
    let constructedData = {
      title,
      description,
      dueDate,
    };

    // updating role info
    const taskData = await Task.findOneAndUpdate(
      { _id: taskId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the task data
    if (!taskData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const taskFromDto = new TaskResponseDto(taskData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: taskFromDto,
    });
  }
);

// upadate task status
export const UpdateTaskStatusById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { taskId } = req.params;
    const parsedData = req.body;

    //get parsed data
    const { status } = parsedData as ITaskUpdate;

    if (!isValidObjectId(taskId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    //validate data with zod schema
    validateZodSchema(TaskUpdateDtoZodSchema, parsedData);

    // Check if a task exists or not
    const existsTask = await Task.findById(taskId);
    if (!existsTask)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);

    //construct data
    let constructedData = {
      status,
    };

    // updating role info
    const taskData = await Task.findOneAndUpdate(
      { _id: taskId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the task data
    if (!taskData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const taskFromDto = new TaskResponseDto(taskData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: taskFromDto,
    });
  }
);

// delete one task
export const DeleteTaskById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;

    if (!taskId)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    const result = await Task.deleteOne({ _id: taskId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
