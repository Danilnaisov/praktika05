import { Schema, model, models } from "mongoose";
import { IDepartment } from "../types";

const departmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: true,
  },
});

export default models.Department ||
  model<IDepartment>("Department", departmentSchema);

  