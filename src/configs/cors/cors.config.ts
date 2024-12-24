//src/config/cors/cors.config.ts

import { environment } from "../environment/environment.config";

export const corsOptions = {
  origin: environment.server.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
