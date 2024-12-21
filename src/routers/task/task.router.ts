//src/routers/task/task.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../utils";

// controllers
import {
  GetAllTasks,
  GetTaskById,
  AddOneTask,
  UpdateTaskById,
  UpdateTaskStatusById,
  DeleteTaskById,
} from "../../controllers";

//routes
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_USER,
    ENUM_AUTH_ROLES.PREMIUM_USER,
  ]),
  GetAllTasks
);
router.get(
  "/find/:taskId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_USER,
    ENUM_AUTH_ROLES.PREMIUM_USER,
  ]),
  GetTaskById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_USER,
    ENUM_AUTH_ROLES.PREMIUM_USER,
  ]),
  AddOneTask
);
router.patch(
  "/update/:taskId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_USER,
    ENUM_AUTH_ROLES.PREMIUM_USER,
  ]),
  UpdateTaskById
);
router.patch(
  "/update-status/:taskId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_USER,
    ENUM_AUTH_ROLES.PREMIUM_USER,
  ]),
  UpdateTaskStatusById
);
router.delete(
  "/delete/:taskId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
  ]),
  DeleteTaskById
);

export const TaskRouter = router;
