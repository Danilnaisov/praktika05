import mongoose, { Schema } from "mongoose";

const DormitorySchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date },
  note: { type: String },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

DormitorySchema.index({ studentId: 1 });
DormitorySchema.index({ roomId: 1 });

export default mongoose.models.Dormitory ||
  mongoose.model("Dormitory", DormitorySchema);
