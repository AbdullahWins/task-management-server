//src/routers/user/user.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../utils";

// controllers
import {
  SignInUser,
  SignUpUser,
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
} from "../../controllers";

//routes
router.post("/signin", SignInUser);
router.post("/signup", SignUpUser);
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
  ]),
  GetAllUsers
);
router.get(
  "/find/:userId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
  ]),
  GetUserById
);
router.patch(
  "/update/:userId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
  ]),
  UpdateUserById
);
router.delete(
  "/delete/:userId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
  ]),
  DeleteUserById
);

export const UserRouter = router;
