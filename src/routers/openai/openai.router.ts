//src/routers/openai/openai.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../utils";

// controllers
import {
  createSummaryByTaskId,
  createPlanToFinishByTaskId,
} from "../../controllers";

//routes
router.get(
  "/summary/:taskId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_USER,
    ENUM_AUTH_ROLES.PREMIUM_USER,
  ]),
  createSummaryByTaskId
);
router.get(
  "/plan/:taskId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_USER,
    ENUM_AUTH_ROLES.PREMIUM_USER,
  ]),
  createPlanToFinishByTaskId
);

export const OpenaiRouter = router;
