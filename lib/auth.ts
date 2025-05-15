import jwt from "jsonwebtoken";
import { User } from "@/types/user";

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );
}

export function verifyToken(token: string): User {
  return jwt.verify(token, process.env.JWT_SECRET!) as User;
}

export async function getAuthUser(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/check", { credentials: "include" });
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export function requireAuth(roles: string[] = []) {
  return async (request: Request) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Не авторизован" }), {
        status: 401,
      });
    }
    try {
      const user = verifyToken(token);
      if (roles.length && !roles.includes(user.role)) {
        return new Response(JSON.stringify({ error: "Недостаточно прав" }), {
          status: 403,
        });
      }
      return { user };
    } catch {
      return new Response(JSON.stringify({ error: "Неверный токен" }), {
        status: 401,
      });
    }
  };
}
