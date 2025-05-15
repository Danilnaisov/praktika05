import { NextResponse } from "next/server";
import initMongoose from "@/lib/mongodb";
import Department from "@/models/Department";
import mongoose from "mongoose";

export async function GET() {
  try {
    await initMongoose();
    const departments = await Department.find().lean();
    await mongoose.disconnect();
    return NextResponse.json(departments);
  } catch (error) {
    await mongoose.disconnect();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
