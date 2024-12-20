//src/routers/main/routes.ts
import express, { Router } from "express";
import {
  AdminRouter,
  TicketRouter,
  UserRouter,
} from "..";

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
    path: "/tickets",
    route: TicketRouter,
  },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
