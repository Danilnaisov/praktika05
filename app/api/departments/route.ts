/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Department from "../../../models/Department";
import ErrorLog from "../../../models/ErrorLog";
import { IDepartment } from "../../../types";
import { verifyToken } from "../../../utils/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const departments = await Department.find();
    return NextResponse.json(departments);
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "GET_DEPARTMENTS_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (user.role !== "Admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data: IDepartment = await req.json();
    if (!data.name)
      return NextResponse.json(
        { error: "Поле name обязательно" },
        { status: 400 }
      );

    const department = await Department.create(data);
    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "POST_DEPARTMENT_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
