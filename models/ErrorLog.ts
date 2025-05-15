import mongoose, { Schema } from "mongoose";

const ErrorLogSchema = new Schema({
  errorCode: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

ErrorLogSchema.index({ timestamp: 1 });

export default mongoose.models.ErrorLog ||
  mongoose.model("ErrorLog", ErrorLogSchema);
