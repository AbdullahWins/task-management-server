//src/configs/passport/passport.config.ts
import passport from "passport";
import { Model } from "mongoose";
import { configureJwtStrategy, configureLocalStrategy } from "./strategies";
import { environment } from "../environment/environment.config";
import { Admin, User } from "../../models";
import { ApiError } from "../../services";

export const configurePassport = () => {
  try {
    // Local Strategies
    passport.use("admin-local", configureLocalStrategy(Admin as Model<any>));
    passport.use("user-local", configureLocalStrategy(User as Model<any>));

    // JWT Strategies
    passport.use(
      "jwt",
      configureJwtStrategy(environment.jwt.JWT_ACCESS_TOKEN_SECRET)
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, "An unknown error occurred");
    }
  }
};
