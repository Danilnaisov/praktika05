import { Schema, model, models } from "mongoose";
import { IDisabilityStatus } from "../types";

const disabilityStatusSchema = new Schema<IDisabilityStatus>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  order: {
    type: String,
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
  disabilityType: {
    type: String,
    required: true,
  },
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

export default models.DisabilityStatus ||
  model<IDisabilityStatus>("DisabilityStatus", disabilityStatusSchema);
