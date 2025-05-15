import mongoose, { Schema } from "mongoose";

const StudentSchema = new Schema({
  lastName: { type: String, required: true, match: /^[А-Яа-яA-Za-z]+$/ },
  firstName: { type: String, required: true, match: /^[А-Яа-яA-Za-z]+$/ },
  middleName: { type: String, match: /^[А-Яа-яA-Za-z]+$/ },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ["М", "Ж"], required: true },
  phone: {
    type: String,
    required: true,
    match: /^\+7 \(\d{3}\)-\d{3}-\d{2}-\d{2}$/,
  },
  education: { type: String, enum: ["9 кл.", "11 кл."], required: true },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  group: { type: String, required: true },
  funding: { type: String, enum: ["Бюджет", "Внебюджет"], required: true },
  admissionYear: { type: Number, required: true },
  graduationYear: { type: Number, required: true },
  expulsionInfo: { type: String },
  expulsionDate: { type: Date },
  note: { type: String },
  parentInfo: { type: String },
  penalties: { type: String },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

StudentSchema.index({ lastName: 1 });
StudentSchema.index({ phone: 1 });
StudentSchema.index({ departmentId: 1 });
StudentSchema.index({ admissionYear: 1 });

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
