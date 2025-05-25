import { Schema, model, models } from "mongoose";
import { IFile } from "../types";

const fileSchema = new Schema<IFile>({
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  entityType: {
    type: String,
    enum: [
      "Student",
      "OrphanStatus",
      "DisabilityStatus",
      "OvzStatus",
      "Dormitory",
      "RiskGroupSop",
      "Sppp",
      "SvoStatus",
      "SocialScholarship",
    ],
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    required: true,
  },
});

export default models.File || model<IFile>("File", fileSchema);
