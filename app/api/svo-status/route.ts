/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import SvoStatus from "../../../models/SvoStatus";
import File from "../../../models/File";
import ErrorLog from "../../../models/ErrorLog";
import { ISvoStatus } from "../../../types";
import { verifyToken } from "../../../utils/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const statuses = await SvoStatus.find().populate("studentId files");
    return NextResponse.json(statuses);
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "GET_SVO_STATUS_ERROR",
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

    const data: ISvoStatus = await req.json();
    const requiredFields = ["studentId", "document", "startDate"];
    for (const field of requiredFields) {
      if (!data[field as keyof ISvoStatus]) {
        return NextResponse.json(
          { error: `Поле ${field} обязательно` },
          { status: 400 }
        );
      }
    }

    const status = await SvoStatus.create(data);
    return NextResponse.json(status, { status: 201 });
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "POST_SVO_STATUS_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (user.role !== "Admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data: ISvoStatus = await req.json();
    if (!data._id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    const status = await SvoStatus.findByIdAndUpdate(data._id, data, {
      new: true,
    });
    if (!status)
      return NextResponse.json({ error: "Статус не найден" }, { status: 404 });

    return NextResponse.json(status);
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "PUT_SVO_STATUS_ERROR",
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

    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    const relatedFiles = await File.find({
      entityId: id,
      entityType: "SvoStatus",
    });
    if (relatedFiles.length > 0) {
      return NextResponse.json(
        { error: "Нельзя удалить статус, связанный с файлами" },
        { status: 400 }
      );
    }

    const status = await SvoStatus.findByIdAndDelete(id);
    if (!status)
      return NextResponse.json({ error: "Статус не найден" }, { status: 404 });

    return NextResponse.json({ message: "Статус удален" });
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "DELETE_SVO_STATUS_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
