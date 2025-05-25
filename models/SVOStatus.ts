import { Schema, model, models } from "mongoose";
import { ISvoStatus } from "../types";

const svoStatusSchema = new Schema<ISvoStatus>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    note: {
      type: String,
    },
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default models.SvoStatus ||
  model<ISvoStatus>("SvoStatus", svoStatusSchema);
