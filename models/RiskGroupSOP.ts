import { Schema, model, models } from "mongoose";
import { IRiskGroupSop } from "../types";

const riskGroupSopSchema = new Schema<IRiskGroupSop>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    type: {
      type: String,
      enum: ["sop", "risk"],
      required: true,
    },
    startDate: {
      type: Date,
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
    endDate: {
      type: Date,
    },
    endReason: {
      type: String,
    },
    endBasis: {
      type: String,
    },
    note: {
      type: String,
    },
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default models.RiskGroupSop ||
  model<IRiskGroupSop>("RiskGroupSop", riskGroupSopSchema);
