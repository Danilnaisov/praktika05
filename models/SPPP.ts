import mongoose, { Schema } from "mongoose";

const SPPPSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  date: { type: Date, required: true },
  attendeesEmployees: { type: String, required: true },
  attendeesRepresentatives: { type: String },
  reason: { type: String, required: true },
  basis: { type: String, required: true },
  decision: { type: String, required: true },
  note: { type: String },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

SPPPSchema.index({ studentId: 1 });

export default mongoose.models.SPPP || mongoose.model("SPPP", SPPPSchema);
