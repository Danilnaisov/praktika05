import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Employee"], required: true },
});

UserSchema.index({ username: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
