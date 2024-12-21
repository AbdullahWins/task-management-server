// src/dtos/task/task.zod.ts
import { z } from "zod";

const TaskDtoZodSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.number(),
  status: z.string(),
});

// Extended DTO schema for adding a task
export const TaskAddDtoZodSchema = TaskDtoZodSchema.pick({
  title: true,
  description: true,
  dueDate: true,
});

// Extended DTO schema for updating a task
export const TaskUpdateDtoZodSchema = TaskDtoZodSchema.partial();
