//src/models/task/task.model.ts
import mongoose, { Schema, model } from "mongoose";
import moment from "moment";
import { ITask, ITaskDocument, ITaskModel } from "../../interfaces";

const TaskSchema = new Schema<ITaskDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  dueDate: {
    type: String,
    required: [true, "Due date is required"],
  },
  status: {
    type: String,
    enum: ["pending", "completed", "overdue"],
    default: "pending",
  },
  createdAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
  updatedAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
});

// update updatedAt on every update
TaskSchema.pre<ITaskDocument>("updateOne", function (next) {
  this.updatedAt = moment().utc().unix();
  next();
});

// checking is task found with the id
TaskSchema.statics.isTaskExistsById = async function (
  taskId: string,
  select: string
): Promise<ITask | null> {
  const task = await this.findById(taskId).select(select).lean();
  return task;
};

const Task = model<ITaskDocument, ITaskModel>("Task", TaskSchema);

export default Task;
