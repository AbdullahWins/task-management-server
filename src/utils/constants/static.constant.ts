//src/utils/constants/static.constant.ts
export const staticProps = {
  default: {
    DEFAULT_IMAGE_PATH: "public/default/default.png",
    DEFAULT_DOCUMENT_PATH: "public/default/default.png",
  },

  monitor: {
    FAILED_TO_FETCH_METRICS: "Failed to fetch metrics",
  },

  database: {
    CONNECTION_SUCCESS: "Connected to MongoDB using Mongoose!",
    CONNECTION_ERROR: "Error connecting database",
  },

  common: {
    INVALID_DATA: "Invalid data!",
    FAILED_TO_CREATE: "Failed to create!",
    SOMETHING_WENT_WRONG: "Something went wrong!",
    NOT_FOUND: "Not found!",

    FILE_NOT_FOUND: "File not found!",
    FILE_RETRIEVED: "File retrieved successfully!",

    ALREADY_EXISTS: "Already exists!",

    CREATED: "Created successfully!",
    RETRIEVED: "Retrieved successfully!",
    UPDATED: "Updated successfully!",
    DELETED: "Deleted successfully!",

    PASSWORD_UPDATED: "Password updated successfully!",
    PASSWORD_RESET: "Password reset successfully!",
    LOGGED_IN: "Logged in successfully!",
    LOGGED_OUT: "Logged out successfully!",

    INVALID_ID: "Invalid ID format!",
    INVALID_CREDENTIALS: "Invalid credentials!",
    INVALID_PASSWORD: "Invalid password!",

    FORBIDDEN: "Forbidden!",
    UNAUTHORIZED: "Unauthorized!",
    DATA_REQUIRED: "Data is required!",
    MISSING_REQUIRED_FIELDS: "Missing required fields!",

    MULTER_ERROR: "Multer error occured!",
    VALIDATION_ERROR: "Validation error!",
    INTERNAL_SERVER_ERROR: "Internal server error!",
  },

  jwt: {
    INVALID_TOKEN: "Invalid token!",
    TOKEN_EXPIRED: "Token has expired!",
    TOKEN_NOT_ACTIVE: "Token not active!",
    TOKEN_VERIFIED: "Token verified successfully!",
    TOKEN_GENERATED: "Token generated successfully!",
    TOKEN_GENERATION_FAILED: "Failed to generate token!",
    TOKEN_REFRESHED: "Token refreshed successfully!",
    TOKEN_REVOKED: "Token revoked successfully!",
    TOKEN_NOT_FOUND: "Token not found!",
    INVALID_ROLE_IN_JWT: "Invalid role in JWT!",
    NO_ENTITY_FOUND: "No entity found for the given ID",
    JWT_STRATEGY_ERROR: "JWT Strategy - Error:",
  },

  cast: {
    INVALID_ID: "Passed id is invalid!",
    CAST_ERROR: "Cast Error occured!",
  },
};
