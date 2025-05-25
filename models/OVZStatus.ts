import { Schema, model, models } from "mongoose";
import { IOvzStatus } from "../types";

const ovzStatusSchema = new Schema<IOvzStatus>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  order: {
    type: String,
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
});

export default models.OvzStatus ||
  model<IOvzStatus>("OvzStatus", ovzStatusSchema);
