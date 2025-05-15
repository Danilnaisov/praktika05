import { NextResponse } from "next/server";
import initMongoose from "@/lib/mongodb";
import Student from "@/models/Student";
import mongoose from "mongoose";

export async function GET() {
  try {
    await initMongoose();
    const students = await Student.find()
      .populate({
        path: "departmentId",
        model: "Department",
      })
      .lean();
    await mongoose.disconnect();
    return NextResponse.json(students);
  } catch (error) {
    await mongoose.disconnect();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initMongoose();
    const data = await request.json();
    const student = await Student.create(data);
    await mongoose.disconnect();
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    await mongoose.disconnect();
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await initMongoose();
    const { id } = await request.json();
    const hasLinks = await Promise.any([
      mongoose.model("OrphanStatus").exists({ studentId: id }),
      mongoose.model("DisabilityStatus").exists({ studentId: id }),
      mongoose.model("OVZStatus").exists({ studentId: id }),
      mongoose.model("Dormitory").exists({ studentId: id }),
      mongoose.model("RiskGroupSOP").exists({ studentId: id }),
      mongoose.model("SPPP").exists({ studentId: id }),
      mongoose.model("SVOStatus").exists({ studentId: id }),
      mongoose.model("SocialScholarship").exists({ studentId: id }),
    ]);
    if (hasLinks) {
      await mongoose.disconnect();
      return NextResponse.json(
        { error: "Нельзя удалить студента, связанного с другими модулями" },
        { status: 400 }
      );
    }
    await Student.findByIdAndDelete(id);
    await mongoose.disconnect();
    return NextResponse.json({ message: "Студент удалён" });
  } catch (error) {
    await mongoose.disconnect();
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
