//src/configs/environment/environment.config.ts
import dotenv from "dotenv";
import path from "path";
import { projectRootPath } from "../../utils";

dotenv.config({
  path: projectRootPath ? path.join(projectRootPath, ".env") : ".env",
});

export const environment = {
  server: {
    SERVER_ENV: process.env.SERVER_ENV || "development",
    SERVER_PORT: Number(process.env.SERVER_PORT) || 5000,
    SERVER_BASE_URL: process.env.SERVER_BASE_URL || "http://localhost:6000",
  },

  db: {
    MONGOOSE_URI: process.env.MONGOOSE_URI || "mongodb://localhost:27017",
  },

  openai: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "default",
  },

  jwt: {
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "default",
    JWT_ACCESS_TOKEN_EXPIRATION_TIME:
      process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || "15m",
  },

  encryption: {
    BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND) || 10,
  },

  log: {
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
  },
};
