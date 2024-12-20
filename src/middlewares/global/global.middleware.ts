//src/middlewares/global/global.middleware.ts
import express from "express";
import passport from "passport";
import { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import { upload } from "../../configs/multer/multer.config";
import { requestLoggerMiddleware } from "../logger/logger.middleware";
import { promClientMiddleware } from "../monitor/monitor.middleware";
import { configurePassport } from "../../configs/passport/passport.config";
import { parseJsonBodyMiddleware } from "../parse/parse.middleware";

export const globalMiddleware = (app: Application) => {
  app.use(cors());
  app.use(sanitize());
  app.use(helmet());
  app.use(requestLoggerMiddleware);

  // Add body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Multer middleware for handling multipart/form-data (both files and text)
  app.use(
    upload.fields([
      { name: "single", maxCount: 1 },
      { name: "document", maxCount: 1 },
      { name: "multiple", maxCount: 10 },
    ])
  );

  // Custom JSON parsing middleware
  app.use(parseJsonBodyMiddleware);

  // Prometheus metrics middleware
  app.use(promClientMiddleware);

  // Initialize Passport configuration
  configurePassport();
  app.use(passport.initialize());
};
