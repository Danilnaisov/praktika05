import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import File from "../../../models/File";
import ErrorLog from "../../../models/ErrorLog";
import { IFile } from "../../../types";
import { verifyToken } from "../../../utils/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const files = await File.find();
    return NextResponse.json(files);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    await ErrorLog.create({
      errorCode: "GET_FILES_ERROR",
      message: errorMessage,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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

    const data = (await req.json()) as IFile;
    const requiredFields = [
      "entityId",
      "entityType",
      "path",
      "uploadedAt",
    ] as const;
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Поле ${field} обязательно` },
          { status: 400 }
        );
      }
    }

    const file = await File.create(data);
    return NextResponse.json(file, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    await ErrorLog.create({
      errorCode: "POST_FILE_ERROR",
      message: errorMessage,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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

    const { id } = (await req.json()) as { id: string };
    if (!id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    const file = await File.findByIdAndDelete(id);
    if (!file)
      return NextResponse.json({ error: "Файл не найден" }, { status: 404 });

    return NextResponse.json({ message: "Файл удален" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    await ErrorLog.create({
      errorCode: "DELETE_FILE_ERROR",
      message: errorMessage,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
