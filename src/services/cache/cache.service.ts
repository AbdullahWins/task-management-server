//src/services/cache/cache.service.ts
import { redis } from "../../configs";

//getter
export const getCache = async <T>(key: string): Promise<T | null> => {
  const cachedData = await redis.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
};

//setter
export const setCache = async <T>(
  key: string,
  value: T,
  ttl: number = 60
): Promise<void> => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

//delete
export const deleteCache = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};
