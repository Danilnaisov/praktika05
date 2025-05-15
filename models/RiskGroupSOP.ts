import mongoose, { Schema } from "mongoose";

const RiskGroupSOPSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  type: { type: String, enum: ["Группа риска", "СОП"], required: true },
  registrationDate: { type: Date, required: true },
  registrationReason: { type: String },
  registrationBasis: { type: String },
  deregistrationDate: { type: Date },
  deregistrationReason: { type: String },
  deregistrationBasis: { type: String },
  note: { type: String },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

RiskGroupSOPSchema.index({ studentId: 1 });

export default mongoose.models.RiskGroupSOP ||
  mongoose.model("RiskGroupSOP", RiskGroupSOPSchema);
