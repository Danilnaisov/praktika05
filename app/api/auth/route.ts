import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import ErrorLog from "../../../models/ErrorLog";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginRequest {
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { username, password } = (await req.json()) as LoginRequest;

    // Валидация входных данных
    if (!username || !password) {
      return NextResponse.json(
        { error: "Требуются имя пользователя и пароль" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return NextResponse.json(
        { error: "Неверное имя пользователя или пароль" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Неверное имя пользователя или пароль" },
        { status: 401 }
      );
    }

    // Создаем JWT токен
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Возвращаем данные пользователя (без пароля)
    const userData = {
      id: user._id,
      username: user.username,
      role: user.role,
      fullName: user.fullName || "",
    };

    return NextResponse.json({
      token,
      user: userData,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    await ErrorLog.create({
      errorCode: "AUTH_ERROR",
      message: errorMessage,
      timestamp: new Date(),
    });
    return NextResponse.json(
      { error: "Ошибка сервера при авторизации" },
      { status: 500 }
    );
  }
}
