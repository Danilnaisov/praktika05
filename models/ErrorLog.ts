import { Schema, model, models } from "mongoose";
import { IErrorLog } from "../types";

const errorLogSchema = new Schema<IErrorLog>({
  errorCode: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default models.ErrorLog || model<IErrorLog>("ErrorLog", errorLogSchema);
