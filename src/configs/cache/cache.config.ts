//src/configs/database/redis.config.ts
import Redis from "ioredis";
import { environment } from "../environment/environment.config";
import { errorLogger, infoLogger } from "../../services";

//create and export the Redis client instance
export const redis = new Redis(environment.db.REDIS_URI);

export const connectToRedis = async () => {
  try {
    const response = await redis.ping();
    infoLogger.info(`Connected to Redis: ${response}`);
  } catch (error) {
    errorLogger.error(
      `Error connecting to Redis: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
    process.exit(1);
  }
};
