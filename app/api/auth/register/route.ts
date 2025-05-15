import { NextResponse } from "next/server";
import initMongoose from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const auth = await requireAuth(["Admin"]);
  if (auth instanceof Response) return auth;

  try {
    await initMongoose();
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }
    if (role && !["Admin", "Employee"].includes(role)) {
      return NextResponse.json({ error: "Неверная роль" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email уже занят" }, { status: 400 });
    }

    const user = await User.create({
      email,
      password,
      role: role || "Employee",
    });
    await mongoose.disconnect();
    return NextResponse.json(
      {
        message: "Пользователь создан",
        user: { email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    await mongoose.disconnect();
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
