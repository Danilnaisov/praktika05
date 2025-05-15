"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#9EA1A2]/20 p-6">
      <Card className="max-w-md w-full bg-white/80 border-[#0060AC]/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#0060AC] text-center">
            Пермский авиационный техникум
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#0060AC] text-center">
            База данных по воспитательной работе
          </p>
          <div className="flex flex-col space-y-2">
            <Button
              asChild
              className="bg-[#E41613] hover:bg-[#C41411] text-white"
            >
              <Link href="/students">Список студентов</Link>
            </Button>
            <Button
              asChild
              className="bg-[#E41613] hover:bg-[#C41411] text-white"
            >
              <Link href="/students/add">Добавить студента</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
