import httpStatus from "http-status";
import passport from "passport";
import { AdminResponseDto, AdminSignupDtoZodSchema } from "../../dtos";
import {
  sendResponse,
  staticProps,
} from "../../utils";
import {
  ApiError,
  generateJwtToken,
  hashPassword,
  uploadFiles,
  validateZodSchema,
} from "../../services";
import { Admin } from "../../models";
import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  IAdmin,
  IMulterFiles,
  PassportAuthError,
  PassportAuthInfo,
} from "../../interfaces";
import { catchAsync } from "../../middlewares";

// Admin Login using Local Strategy (email/password)
export const SignInAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "admin-local",
    async (err: PassportAuthError, admin: IAdmin, info: PassportAuthInfo) => {
      if (err) {
        return next(err);
      }

      if (!admin) {
        return res.status(401).json({
          message: info?.message || staticProps.common.UNAUTHORIZED,
        });
      }

      // If admin is authenticated, generate JWT token
      const token = generateJwtToken(admin);

      if (!token) {
        return res.status(500).json({ message: staticProps.jwt.TOKEN_GENERATION_FAILED });
      }

      // Return the token and admin info
      res.status(200).json({
        message: staticProps.common.LOGGED_IN,
        accessToken: token,
        admin: admin,
      });
    }
  )(req, res, next);
};

// signup admin
export const SignUpAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Get data
    const { single } = req.files as IMulterFiles;
    const { email, fullName, password, role } = req.body;

    validateZodSchema(AdminSignupDtoZodSchema, req.body);

    // Check if admin already exists
    const findAdmin = await Admin.isEntityExistsByEmail(email as string);
    if (findAdmin) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.ALREADY_EXISTS
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password as string);

    // Data to be stored
    let constructedData = {
      email,
      fullName,
      password: hashedPassword,
      image: staticProps.default.DEFAULT_IMAGE_PATH,
      role,
    };

    // Upload files
    if (single) {
      const { filePath } = await uploadFiles(single);
      constructedData = {
        ...constructedData,
        image: filePath || staticProps.default.DEFAULT_IMAGE_PATH,
      };
    }

    // Create admin
    const admin = await Admin.create(constructedData);

    // Generate JWT payload and token
    const JwtPayload = {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
    };

    // Generate token
    const token = generateJwtToken(JwtPayload);

    // Create admin DTO response
    const adminFromDto = new AdminResponseDto(admin);

    // Prepare updated data with token
    const updatedData = {
      accessToken: token,
      admin: adminFromDto,
    };

    // Send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.CREATED,
      data: updatedData,
    });
  }
);
