import { Schema, model, models } from "mongoose";
import { IDormitory } from "../types";

const dormitorySchema = new Schema<IDormitory>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
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

export default models.Dormitory ||
  model<IDormitory>("Dormitory", dormitorySchema);
