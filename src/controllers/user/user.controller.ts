// src/controllers/user/user.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { User } from "../../models";
import {
  ApiError,
  deleteCache,
  getCache,
  hashPassword,
  setCache,
  uploadFiles,
} from "../../services";
import {
  staticProps,
  sendResponse,
  parseQueryData,
  paginate,
  ENUM_ADMIN_ROLES,
} from "../../utils";
import { IMulterFiles, IUser } from "../../interfaces";
import { UserResponseDto } from "../../dtos";
import { catchAsync } from "../../middlewares";

// get all users
export const GetAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    //get the cache
    const cacheKey = `users:page:${page}:limit:${limit}`;
    const cachedUsers = await getCache<{ data: UserResponseDto[]; meta: any }>(
      cacheKey
    );

    if (cachedUsers) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        message: staticProps.common.RETRIEVED,
        data: cachedUsers.data,
        meta: cachedUsers.meta,
      });
    }

    //if cache is unavailable, get data from db
    const paginatedResult = await paginate(User.find(), { page, limit });

    const usersFromDto = paginatedResult.data.map(
      (user) => new UserResponseDto(user.toObject())
    );

    //set the cache
    await setCache(cacheKey, {
      data: usersFromDto,
      meta: paginatedResult.meta,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: usersFromDto,
      meta: paginatedResult.meta,
    });
  }
);

//get one user
export const GetUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const authUser = req.user as IUser;

    //validate ID format before any further processing
    if (!isValidObjectId(userId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    //check if the authenticated user is an admin
    const isAdmin =
      authUser.role &&
      Object.values(ENUM_ADMIN_ROLES).includes(
        authUser.role as ENUM_ADMIN_ROLES
      );

    //if not an admin, ensure the user is trying to access their own data
    if (!isAdmin && userId !== authUser._id.toString()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.CAN_NOT_RETRIVE_OTHERS_DATA
      );
    }

    //get the cache
    const cacheKey = `user:${userId}`;
    const cachedUser = await getCache<UserResponseDto>(cacheKey);
    if (cachedUser) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        message: staticProps.common.RETRIEVED,
        data: cachedUser,
      });
    }

    //if cache is unavailable, get data from db
    const user = await User.findById(userId).lean();

    //if user not found, throw an error
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    // Transform the user data into the response DTO
    const userFromDto = new UserResponseDto(user);

    //set the cache
    await setCache(cacheKey, userFromDto);

    //send the response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: userFromDto,
    });
  }
);

// update one user
export const UpdateUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { userId } = req.params;
    const parsedData = req.body;
    const authUser = req.user as IUser;

    // Check if the authenticated user is an admin
    const isAdmin =
      authUser.role &&
      Object.values(ENUM_ADMIN_ROLES).includes(
        authUser.role as ENUM_ADMIN_ROLES
      );

    // If not an admin, ensure the user is trying to access their own data
    if (!isAdmin && userId !== authUser._id.toString()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.CAN_NOT_UPDATE_OTHERS_DATA
      );
    }

    // esure userId and parsedData exist
    if (!userId || !parsedData) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.MISSING_REQUIRED_FIELDS
      );
    }

    // Get the parsed data excluding the password
    const { password, ...body } = parsedData;

    // Check if the user exists
    const existsUser = await User.findById(userId);
    if (!existsUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);
    }

    // Construct data to be updated
    let constructedData = { ...body };

    // Hash password if provided
    if (password) {
      const hashedPassword = await hashPassword(password);
      constructedData = {
        ...constructedData,
        password: hashedPassword,
      };
    }

    // Upload file if provided
    const { single } = req.files as IMulterFiles;
    if (single) {
      const { filePath } = await uploadFiles(single);
      constructedData = {
        ...constructedData,
        image: filePath || staticProps.default.DEFAULT_IMAGE_PATH,
      };
    }

    // Update the user
    const data = await User.findOneAndUpdate(
      { _id: userId },
      { $set: constructedData },
      { new: true, runValidators: true }
    );

    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const userFromDto = new UserResponseDto(data);

    //update the cache
    await setCache(`user:${userId}`, userFromDto);

    // Send the response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: userFromDto,
    });
  }
);

// delete one user
export const DeleteUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const authUser = req.user as IUser;

    // Check if the authenticated user is an admin
    const isAdmin =
      authUser.role &&
      Object.values(ENUM_ADMIN_ROLES).includes(
        authUser.role as ENUM_ADMIN_ROLES
      );

    // If not an admin, ensure the user is trying to access their own data
    if (!isAdmin && userId !== authUser._id.toString()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.CAN_NOT_DELETE_OTHERS_DATA
      );
    }

    if (!isValidObjectId(userId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    //delete the cache
    await deleteCache(`user:${userId}`);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
