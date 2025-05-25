import { Schema, model, models } from "mongoose";
import { ISppp } from "../types";

const spppSchema = new Schema<ISppp>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  attendeesEmployees: {
    type: String,
    required: true,
  },
  attendeesRepresentatives: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  basis: {
    type: String,
    required: true,
  },
  decision: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
});

export default models.Sppp || model<ISppp>("Sppp", spppSchema);
