/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyAuthToken(token);
    }
  }, [router]);

  const verifyAuthToken = async (token: string) => {
    try {
      const response = await fetch("/api/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.valid && data.user) {
        localStorage.setItem("user", data.user.username);
        localStorage.setItem("role", data.user.role);
        router.push("/students");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Ошибка авторизации");
      }

      const { token, user } = await response.json();

      localStorage.setItem("token", token);
      localStorage.setItem("user", user.username);
      localStorage.setItem("role", user.role);

      router.push("/students");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECECEC]">
      <div
        className="bg-white rounded-[20px] border border-[#B0CDE4] shadow p-8 max-w-lg w-full flex flex-col items-center"
        style={{ minWidth: 380 }}
      >
        <div className="flex items-center w-full mb-4 flex-col">
          <Image
            src="/logo.svg"
            alt="Логотип"
            width={64}
            height={64}
            className="mr-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-[#0060AC] leading-tight mb-1 text-center">
            Пермский авиационный техникум
          </h1>
        </div>
        <div className="text-[#0060AC] text-lg mb-6 text-center w-full">
          База данных по воспитательной работе
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-[#B0CDE4] rounded-[12px] text-lg placeholder-[#737373] focus:border-[#0060AC] outline-none"
            placeholder="Логин"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-[#B0CDE4] rounded-[12px] text-lg placeholder-[#737373] focus:border-[#0060AC] outline-none"
            placeholder="Пароль"
            required
          />
          {error && <p className="text-red-600 text-center -mb-2">{error}</p>}
          <Button
            type="submit"
            className="w-full p-3 bg-[#0060AC] hover:bg-[#004080] text-white rounded-[12px] text-lg font-semibold mt-2 transition-colors"
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
