/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/models/Room";
import Dormitory from "../../../models/Dormitory";
import ErrorLog from "../../../models/ErrorLog";
import { IRoom } from "../../../types";
import { verifyToken } from "../../../utils/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await Promise.all([
      import("@/models/Student"),
      import("@/models/Department"),
      import("@/models/File"),
      import("@/models/ErrorLog"),
      import("@/models/OrphanStatus"),
      import("@/models/DisabilityStatus"),
      import("@/models/OvzStatus"),
      import("@/models/SvoStatus"),
      import("@/models/SocialScholarship"),
      import("@/models/RiskGroupSop"),
      import("@/models/Sppp"),
      import("@/models/Dormitory"),
      import("@/models/Room"),
    ]);

    const rooms = await Room.find().sort({ name: 1 });

    // Получаем информацию о проживающих через Dormitory
    const roomsWithStudents = await Promise.all(
      rooms.map(async (room) => {
        const dormitoryRecords = await Dormitory.find({
          roomId: room._id,
          $or: [{ endDate: { $gt: new Date() } }, { endDate: null }],
        }).populate({
          path: "studentId",
          select: "_id firstName lastName middleName birthDate group phone",
          model: "Student",
        });

        // Формируем студентов с данными о заселении
        const students = dormitoryRecords
          .filter((record) => record.studentId)
          .map((record) => ({
            ...record.studentId.toObject(),
            dormitory: {
              startDate: record.startDate,
              endDate: record.endDate,
              note: record.note,
            },
          }));

        return {
          ...room.toObject(),
          students,
        };
      })
    );

    return NextResponse.json(roomsWithStudents);
  } catch (error: unknown) {
    const err = error as Error;
    await ErrorLog.create({
      errorCode: "GET_ROOMS_ERROR",
      message: err.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (user.role !== "Admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await req.json();
    const room = new Room({
      name: body.name,
      capacity: body.capacity || 2,
      note: body.note || "",
    });
    await room.save();

    return NextResponse.json(room, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    await ErrorLog.create({
      errorCode: "POST_ROOM_ERROR",
      message: err.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: err.message }, { status: 500 });
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

    const data: IRoom = await req.json();
    if (!data._id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    const room = await Room.findByIdAndUpdate(data._id, data, { new: true });
    if (!room)
      return NextResponse.json(
        { error: "Комната не найдена" },
        { status: 404 }
      );

    return NextResponse.json(room);
  } catch (error: unknown) {
    const err = error as Error;
    await ErrorLog.create({
      errorCode: "PUT_ROOM_ERROR",
      message: err.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: err.message }, { status: 500 });
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

    const relatedRecords = await Dormitory.find({ roomId: id });
    if (relatedRecords.length > 0) {
      return NextResponse.json(
        { error: "Нельзя удалить комнату, связанную с общежитием" },
        { status: 400 }
      );
    }

    const room = await Room.findByIdAndDelete(id);
    if (!room)
      return NextResponse.json(
        { error: "Комната не найдена" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Комната удалена" });
  } catch (error: unknown) {
    const err = error as Error;
    await ErrorLog.create({
      errorCode: "DELETE_ROOM_ERROR",
      message: err.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
