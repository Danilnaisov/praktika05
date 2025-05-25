import { Schema, model, models } from "mongoose";
import { ISocialScholarship } from "../types";

const socialScholarshipSchema = new Schema<ISocialScholarship>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    note: {
      type: String,
    },
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default models.SocialScholarship ||
  model<ISocialScholarship>("SocialScholarship", socialScholarshipSchema);
