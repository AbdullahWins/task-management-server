//src/routers/main/routes.ts
import express, { Router } from "express";
import { AdminRouter, TaskRouter, UserRouter, OpenaiRouter } from "..";

export const apiRouter = express.Router();

const apiRoutes: { path: string; route: Router }[] = [
  {
    path: "/users",
    route: UserRouter,
  },
  {
    path: "/admins",
    route: AdminRouter,
  },
  {
    path: "/tasks",
    route: TaskRouter,
  },
  {
    path: "/ai",
    route: OpenaiRouter,
  },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
