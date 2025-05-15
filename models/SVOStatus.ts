import mongoose, { Schema } from "mongoose";

const SVOStatusSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  document: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  note: { type: String },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

SVOStatusSchema.index({ studentId: 1 });

export default mongoose.models.SVOStatus ||
  mongoose.model("SVOStatus", SVOStatusSchema);
