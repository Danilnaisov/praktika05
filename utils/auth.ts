/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { NextRequest } from "next/server";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hashed: string) => {
  return await bcrypt.compare(password, hashed);
};

export const generateToken = (user: {
  _id: string;
  username: string;
  role: string;
}) => {
  return sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: string;
    };
  } catch (err: any) {
    throw new Error("jwt malformed");
  }
};

export const authMiddleware = async (req: NextRequest) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Токен отсутствует");
  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error("Пользователь не найден");
  return { user, role: decoded.role };
};
