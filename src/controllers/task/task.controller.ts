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
  ENUM_ADMIN_ROLES,
} from "../../utils";
import {
  TaskAddDtoZodSchema,
  TaskResponseDto,
  TaskUpdateDtoZodSchema,
} from "../../dtos";
import {
  ApiError,
  getCache,
  setCache,
  validateZodSchema,
} from "../../services";
import { ITaskAdd, ITaskUpdate, IUser } from "../../interfaces";
import { catchAsync } from "../../middlewares";

//get all tasks
export const GetAllTasks: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    //get cached data
    const cacheKey = `tasks:page:${page}:limit:${limit}`;
    const cachedTasks = await getCache<{ data: TaskResponseDto[]; meta: any }>(
      cacheKey
    );

    if (cachedTasks) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        message: staticProps.common.RETRIEVED,
        data: cachedTasks.data,
        meta: cachedTasks.meta,
      });
    }

    //if cache is unavailable, get data from db
    const paginatedResult = await paginate(Task.find(), { page, limit });

    const tasksFromDto = paginatedResult.data.map(
      (task) => new TaskResponseDto(task.toObject())
    );

    //set the cache
    await setCache(cacheKey, {
      data: tasksFromDto,
      meta: paginatedResult.meta,
    });

    // Send the response with tasks
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: tasksFromDto,
      meta: paginatedResult.meta,
    });
  }
);

//get own tasks
export const GetOwnTasks: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const authUser = req.user as IUser;

    //get cached data
    const cacheKey = `tasks:userId:${authUser._id}:page:${page}:limit:${limit}`;
    const cachedTasks = await getCache<{ data: TaskResponseDto[]; meta: any }>(
      cacheKey
    );
    if (cachedTasks) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        message: staticProps.common.RETRIEVED,
        data: cachedTasks.data,
        meta: cachedTasks.meta,
      });
    }

    //if cache is unavailable, get data from db
    const paginatedResult = await paginate(
      Task.find({ userId: authUser._id }),
      { page, limit }
    );

    const tasksFromDto = paginatedResult.data.map(
      (task) => new TaskResponseDto(task.toObject())
    );

    //set the cache
    await setCache(cacheKey, {
      data: tasksFromDto,
      meta: paginatedResult.meta,
    });

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
    const authUser = req.user as IUser;

    // Validate ID format
    if (!isValidObjectId(taskId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const task = await Task.findById(taskId);

    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    // Check if the authenticated user is an admin
    const isAdmin =
      authUser.role &&
      Object.values(ENUM_ADMIN_ROLES).includes(
        authUser.role as ENUM_ADMIN_ROLES
      );

    // If not an admin, ensure the user is trying to access their own data
    if (!isAdmin && task?.userId.toString() !== authUser._id.toString()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.CAN_NOT_RETRIVE_OTHERS_DATA
      );
    }

    //get the cache
    const cacheKey = `task:${taskId}`;
    const cachedTask = await getCache<TaskResponseDto>(cacheKey);
    if (cachedTask) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        message: staticProps.common.RETRIEVED,
        data: cachedTask,
      });
    }

    //if cache is unavailable, get data from db
    const taskFromDto = new TaskResponseDto(task);

    //set the cache
    await setCache(cacheKey, taskFromDto);

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
    const authUser = req.user as IUser;

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

    // Check if the authenticated user is an admin
    const isAdmin =
      authUser.role &&
      Object.values(ENUM_ADMIN_ROLES).includes(
        authUser.role as ENUM_ADMIN_ROLES
      );

    // If not an admin, ensure the user is trying to access their own data
    if (!isAdmin && existsTask?.userId.toString() !== authUser._id.toString()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.CAN_NOT_UPDATE_OTHERS_DATA
      );
    }

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
    const authUser = req.user as IUser;

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

    // Check if the authenticated user is an admin
    const isAdmin =
      authUser.role &&
      Object.values(ENUM_ADMIN_ROLES).includes(
        authUser.role as ENUM_ADMIN_ROLES
      );

    // If not an admin, ensure the user is trying to access their own data
    if (!isAdmin && existsTask?.userId.toString() !== authUser._id.toString()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.CAN_NOT_UPDATE_OTHERS_DATA
      );
    }

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
    const authUser = req.user as IUser;

    if (!taskId)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    // Check if a task exists or not
    const existsTask = await Task.findById(taskId);

    // Check if the authenticated user is an admin
    const isAdmin =
      authUser.role &&
      Object.values(ENUM_ADMIN_ROLES).includes(
        authUser.role as ENUM_ADMIN_ROLES
      );

    // If not an admin, ensure the user is trying to access their own data
    if (!isAdmin && existsTask?.userId.toString() !== authUser._id.toString()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.CAN_NOT_DELETE_OTHERS_DATA
      );
    }

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
