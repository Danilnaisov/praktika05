"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (res.ok) {
        router.push("/students");
      } else {
        setError(result.error || "Ошибка входа");
      }
    } catch {
      setError("Не удалось выполнить вход");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#9EA1A2]/20 p-6">
      <Card className="max-w-md w-full bg-white/80 border-[#0060AC]/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#0060AC] text-center">
            Вход
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#0060AC]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#0060AC] focus:ring-[#0060AC]"
                aria-required="true"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[#0060AC]">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#0060AC] focus:ring-[#0060AC]"
                aria-required="true"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E41613] hover:bg-[#C41411] text-white disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти"}
            </Button>
            {error && (
              <p className="text-[#E41613] text-sm text-center">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
