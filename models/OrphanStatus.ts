import { Schema, model, models } from "mongoose";
import { IOrphanStatus } from "../types";

const orphanStatusSchema = new Schema<IOrphanStatus>({
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
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

export default models.OrphanStatus ||
  model<IOrphanStatus>("OrphanStatus", orphanStatusSchema);
