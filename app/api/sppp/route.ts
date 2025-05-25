/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Sppp from "../../../models/Sppp";
import File from "../../../models/File";
import ErrorLog from "../../../models/ErrorLog";
import { ISppp } from "../../../types";
import { verifyToken } from "../../../utils/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const records = await Sppp.find().populate("studentId files");
    return NextResponse.json(records);
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "GET_SPPP_ERROR",
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

    const data: ISppp = await req.json();
    const requiredFields = [
      "studentId",
      "date",
      "attendeesEmployees",
      "attendeesRepresentatives",
      "reason",
      "basis",
      "decision",
    ];
    for (const field of requiredFields) {
      if (!data[field as keyof ISppp]) {
        return NextResponse.json(
          { error: `Поле ${field} обязательно` },
          { status: 400 }
        );
      }
    }

    const record = await Sppp.create(data);
    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "POST_SPPP_ERROR",
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

    const data: ISppp = await req.json();
    if (!data._id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    const record = await Sppp.findByIdAndUpdate(data._id, data, { new: true });
    if (!record)
      return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });

    return NextResponse.json(record);
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "PUT_SPPP_ERROR",
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

    const relatedFiles = await File.find({ entityId: id, entityType: "Sppp" });
    if (relatedFiles.length > 0) {
      return NextResponse.json(
        { error: "Нельзя удалить запись, связанную с файлами" },
        { status: 400 }
      );
    }

    const record = await Sppp.findByIdAndDelete(id);
    if (!record)
      return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });

    return NextResponse.json({ message: "Запись удалена" });
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "DELETE_SPPP_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
