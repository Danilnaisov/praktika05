import mongoose from "mongoose";
import { IRoom } from "../types";

const roomSchema = new mongoose.Schema<IRoom>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: (v: number) => /^\d+$/.test(v.toString()),
        message: "Вместимость должна быть числом",
      },
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Room ||
  mongoose.model<IRoom>("Room", roomSchema);
