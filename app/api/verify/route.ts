/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      username: string;
      role: string;
    };

    // Возвращаем данные пользователя
    return NextResponse.json({
      valid: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { valid: false, error: "Недействительный токен" },
      { status: 401 }
    );
  }
}
