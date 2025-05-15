import { NextResponse } from "next/server";
import initMongoose from "@/lib/mongodb";
import Department from "@/models/Department";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

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

export async function POST(request: Request) {
  const auth = await requireAuth(["Admin"]);
  if (auth instanceof Response) return auth;

  try {
    await initMongoose();
    const { name, code } = await request.json();
    if (!name || !code) {
      return NextResponse.json(
        { error: "Название и код обязательны" },
        { status: 400 }
      );
    }
    const department = await Department.create({
      name,
      code: code.toUpperCase(),
    });
    await mongoose.disconnect();
    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    await mongoose.disconnect();
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
