import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";
import Student from "@/models/Student";
import Department from "@/models/Department";
import OrphanStatus from "@/models/OrphanStatus";
import DisabilityStatus from "@/models/DisabilityStatus";
import OVZStatus from "@/models/OVZStatus";
import Dormitory from "@/models/Dormitory";
import RiskGroupSOP from "@/models/RiskGroupSOP";
import SPPP from "@/models/SPPP";
import SVOStatus from "@/models/SVOStatus";
import SocialScholarship from "@/models/SocialScholarship";
import Room from "@/models/Room";
import File from "@/models/File";
import User from "@/models/User";
import ErrorLog from "@/models/ErrorLog";

const models = [
  Student,
  Department,
  OrphanStatus,
  DisabilityStatus,
  OVZStatus,
  Dormitory,
  RiskGroupSOP,
  SPPP,
  SVOStatus,
  SocialScholarship,
  Room,
  File,
  User,
  ErrorLog,
];

async function initMongoose() {
  try {
    await clientPromise;
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        bufferCommands: false,
      });
      console.log("Mongoose connected");
    }
    return mongoose.connection;
  } catch (error) {
    console.error("Mongoose connection error:", error);
    throw error;
  }
}

export default initMongoose;
