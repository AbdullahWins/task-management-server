//src/models/common/common.schema.ts
import moment from "moment";
import validator from "validator";
import { Schema } from "mongoose";

// Common schema for common fields
export const CommonEntitySchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  password: {
    type: String,
    validate: {
      validator: function (v: string | null) {
        return v === null || validator.isStrongPassword(v);
      },
      message: "Password must be strong or null",
    },
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

CommonEntitySchema.pre("save", function (next) {
  this.updatedAt = moment().utc().unix();
  if (this.isNew) {
    this.createdAt = moment().utc().unix();
  }
  next();
});

// Add static methods for common operations
CommonEntitySchema.statics.isEntityExistsById = async function (
  id: string,
  select: string
) {
  const entity = await this.findById(id).select(select).lean();
  return entity;
};

CommonEntitySchema.statics.isEntityExistsByEmail = async function (
  email: string,
  select: string
) {
  const entity = await this.findOne({ email }).select(select).lean();
  return entity;
};

