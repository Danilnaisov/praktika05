import mongoose, { Schema } from "mongoose";

const OVZStatusSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  order: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  note: { type: String },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

OVZStatusSchema.index({ studentId: 1 });

export default mongoose.models.OVZStatus ||
  mongoose.model("OVZStatus", OVZStatusSchema);
