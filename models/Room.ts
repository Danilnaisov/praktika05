import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
});

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
