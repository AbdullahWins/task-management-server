// src/dtos/task/task.dto.ts
import { Types } from "mongoose";
import { ITask } from "../../interfaces";

// Base Task DTO
export class TaskDto implements Partial<ITask> {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description: string;
  dueDate: string;
  status: string;

  constructor(task: ITask) {
    this._id = task._id!;
    this.userId = task.userId;
    this.title = task.title;
    this.description = task.description;
    this.dueDate = task.dueDate;
    this.status = task.status;
  }
}

// DTO for task response after signup/signin
export class TaskResponseDto extends TaskDto {
  constructor(task: ITask) {
    super(task);
  }
}
