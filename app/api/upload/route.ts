import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import File from "@/models/File";
import ErrorLog from "@/models/ErrorLog";
import Student from "@/models/Student";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";
    const entityId = formData.get("entityId") as string;
    const entityType = formData.get("entityType") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Файл не предоставлен" },
        { status: 400 }
      );
    }

    if (!entityId || !entityType) {
      return NextResponse.json(
        { error: "Не указан entityId или entityType" },
        { status: 400 }
      );
    }

    // Проверка типа файла
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Разрешена загрузка только PDF файлов" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${uuidv4()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", folder);
    const filePath = path.join(uploadDir, fileName);

    // Создаем директорию, если она не существует
    await fs.mkdir(uploadDir, { recursive: true });

    // Сохраняем файл
    await fs.writeFile(filePath, buffer);

    // Сохраняем метаданные файла в базе данных
    const url = `/${folder}/${fileName}`;
    const newFile = new File({
      entityId: entityId === "new" ? new mongoose.Types.ObjectId() : entityId,
      entityType,
      path: url,
      uploadedAt: new Date(),
    });
    await newFile.save();

    // Находим студента и добавляем файл в его массив files
    let studentId;

    // Получаем ID студента в зависимости от типа сущности
    if (entityId !== "new") {
      switch (entityType) {
        case "Student":
          studentId = entityId;
          break;
        case "Dormitory":
          const dormitory = await mongoose
            .model("Dormitory")
            .findOne({ _id: entityId });
          studentId = dormitory?.studentId;
          break;
        case "OrphanStatus":
          const orphanStatus = await mongoose
            .model("OrphanStatus")
            .findOne({ _id: entityId });
          studentId = orphanStatus?.studentId;
          break;
        case "DisabilityStatus":
          const disabilityStatus = await mongoose
            .model("DisabilityStatus")
            .findOne({ _id: entityId });
          studentId = disabilityStatus?.studentId;
          break;
        case "OvzStatus":
          const ovzStatus = await mongoose
            .model("OvzStatus")
            .findOne({ _id: entityId });
          studentId = ovzStatus?.studentId;
          break;
        case "RiskGroupSop":
          const riskGroupSop = await mongoose
            .model("RiskGroupSop")
            .findOne({ _id: entityId });
          studentId = riskGroupSop?.studentId;
          break;
        case "SvoStatus":
          const svoStatus = await mongoose
            .model("SvoStatus")
            .findOne({ _id: entityId });
          studentId = svoStatus?.studentId;
          break;
        case "SocialScholarship":
          const socialScholarship = await mongoose
            .model("SocialScholarship")
            .findOne({ _id: entityId });
          studentId = socialScholarship?.studentId;
          break;
      }
    }

    // Если нашли ID студента, добавляем файл в его массив files
    if (studentId) {
      const student = await Student.findById(studentId);
      if (student) {
        student.files = [...(student.files || []), newFile._id];
        await student.save();
      }
    }

    return NextResponse.json(
      { url: url, fileId: newFile._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка в /api/upload:", error);
    await ErrorLog.create({
      errorCode: "UPLOAD_FILE_ERROR",
      message: error instanceof Error ? error.message : "Неизвестная ошибка",
      timestamp: new Date(),
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Ошибка при загрузке файла",
      },
      { status: 500 }
    );
  }
}
