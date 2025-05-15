import { NextResponse } from "next/server";
import initMongoose from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await initMongoose();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
    await mongoose.disconnect();

    const response = NextResponse.json({
      message: "Успешный вход",
      user: { email: user.email, role: user.role },
    });
    response.cookies.set("token", token, { httpOnly: true, maxAge: 86400 });
    return response;
  } catch (error) {
    await mongoose.disconnect();
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
