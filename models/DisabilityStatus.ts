import mongoose, { Schema } from "mongoose";

const DisabilityStatusSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  order: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  note: { type: String },
  disabilityType: { type: String, required: true },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

DisabilityStatusSchema.index({ studentId: 1 });

export default mongoose.models.DisabilityStatus ||
  mongoose.model("DisabilityStatus", DisabilityStatusSchema);
