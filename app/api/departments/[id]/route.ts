/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/mongodb";
import Department from "@/models/Department";
import ErrorLog from "@/models/ErrorLog";
import { IDepartment } from "@/types";
import { verifyToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (user.role !== "Admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data: IDepartment = await req.json();

    if (!data._id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    const department = await Department.findByIdAndUpdate(data._id, data, {
      new: true,
    });
    if (!department)
      return NextResponse.json(
        { error: "Отделение не найдено" },
        { status: 404 }
      );

    return NextResponse.json(department);
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "PUT_DEPARTMENT_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (user.role !== "Admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data: IDepartment = await req.json();

    if (!data._id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    const department = await Department.findByIdAndDelete(data._id);
    if (!department)
      return NextResponse.json(
        { error: "Отделение не найдено" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Отделение удалено" });
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "DELETE_DEPARTMENT_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
