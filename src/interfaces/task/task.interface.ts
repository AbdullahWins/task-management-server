// src/interfaces/task/task.interface.ts
import { Model, Types } from "mongoose";
import { ICommonSchema } from "../common/common.interface";

// task interface
export interface ITask extends ICommonSchema {
  userId: Types.ObjectId;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

// task add interface
export interface ITaskAdd {
  userId: Types.ObjectId;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

// task update interface
export interface ITaskUpdate {
  userId?: Types.ObjectId;
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
}

// task schema methods
export interface ITaskModel extends Model<ITask> {
  isTaskExistsById(taskId: string, select?: string): Promise<ITask | null>;
}

export interface ITaskDocument extends ITask, Document {}
