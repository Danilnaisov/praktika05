import mongoose, { Schema } from "mongoose";

const DepartmentSchema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.models.Department ||
  mongoose.model("Department", DepartmentSchema);
