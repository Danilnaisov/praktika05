import mongoose, { Schema } from "mongoose";

const FileSchema = new Schema({
  entityId: { type: Schema.Types.ObjectId, required: true },
  entityType: {
    type: String,
    required: true,
    enum: [
      "Student",
      "OrphanStatus",
      "DisabilityStatus",
      "OVZStatus",
      "Dormitory",
      "RiskGroupSOP",
      "SPPP",
      "SVOStatus",
      "SocialScholarship",
    ],
  },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, required: true, default: Date.now },
});

FileSchema.index({ entityId: 1, entityType: 1 });

export default mongoose.models.File || mongoose.model("File", FileSchema);
