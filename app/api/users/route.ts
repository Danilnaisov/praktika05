import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import ErrorLog from "../../../models/ErrorLog";
import { IUser } from "../../../types";
import { verifyToken } from "../../../utils/auth";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await User.find();
    return NextResponse.json(users);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    await ErrorLog.create({
      errorCode: "GET_USERS_ERROR",
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

    const admin = await verifyToken(token);
    if (admin.role !== "Admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = (await req.json()) as IUser;
    const requiredFields = ["username", "password", "role"] as const;
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Поле ${field} обязательно` },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password: hashedPassword });
    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    await ErrorLog.create({
      errorCode: "POST_USER_ERROR",
      message: errorMessage,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await verifyToken(token);
    if (admin.role !== "Admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = (await req.json()) as IUser;
    if (!data._id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await User.findByIdAndUpdate(data._id, data, { new: true });
    if (!user)
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );

    return NextResponse.json(user);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    await ErrorLog.create({
      errorCode: "PUT_USER_ERROR",
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

    const admin = await verifyToken(token);
    if (admin.role !== "Admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = (await req.json()) as { id: string };
    if (!id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    const user = await User.findByIdAndDelete(id);
    if (!user)
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Пользователь удален" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    await ErrorLog.create({
      errorCode: "DELETE_USER_ERROR",
      message: errorMessage,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
