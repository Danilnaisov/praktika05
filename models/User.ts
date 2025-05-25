import { Schema, model, models } from "mongoose";
import { IUser } from "../types";

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Teacher"],
    required: true,
  },
});

export default models.User || model<IUser>("User", userSchema);
