"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDepartments from "@/hooks/useDepartments";
import useAuth from "@/hooks/useAuth";
import { Student } from "@/types/student";
import Link from "next/link";

export default function StudentsList() {
  const { user, loading: authLoading } = useAuth();
  const { departments, error: deptError } = useDepartments();
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    lastName: "",
    firstName: "",
    group: "",
    departmentId: "",
    admissionYear: "",
  });
  const router = useRouter();

  const fetchStudents = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") query.append(key, value);
      });
      const res = await fetch(`/api/students?${query.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setStudents(data);
        setError(null);
      } else {
        setError(data.error || "Не удалось загрузить студентов");
        setStudents([]);
      }
    } catch {
      setError("Не удалось загрузить студентов");
      setStudents([]);
    }
  }, [filters]);

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user, filters, fetchStudents]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (authLoading || !user) return null;
  if (deptError) return <p className="text-[#E41613]">{deptError}</p>;
  if (error) return <p className="text-[#E41613]">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#9EA1A2]/20 rounded-xl shadow-lg">
      <Card className="bg-white/80 border-[#0060AC]/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#0060AC]">
            Список студентов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lastName" className="text-[#0060AC]">
                  Фамилия
                </Label>
                <Input
                  id="lastName"
                  placeholder="Введите фамилию"
                  value={filters.lastName}
                  onChange={(e) =>
                    handleFilterChange("lastName", e.target.value)
                  }
                  className="border-[#0060AC] focus:ring-[#0060AC]"
                />
              </div>
              <div>
                <Label htmlFor="firstName" className="text-[#0060AC]">
                  Имя
                </Label>
                <Input
                  id="firstName"
                  placeholder="Введите имя"
                  value={filters.firstName}
                  onChange={(e) =>
                    handleFilterChange("firstName", e.target.value)
                  }
                  className="border-[#0060AC] focus:ring-[#0060AC]"
                />
              </div>
              <div>
                <Label htmlFor="group" className="text-[#0060AC]">
                  Группа
                </Label>
                <Input
                  id="group"
                  placeholder="Введите группу"
                  value={filters.group}
                  onChange={(e) => handleFilterChange("group", e.target.value)}
                  className="border-[#0060AC] focus:ring-[#0060AC]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departmentId" className="text-[#0060AC]">
                  Отделение
                </Label>
                <Select
                  value={filters.departmentId}
                  onValueChange={(value) =>
                    handleFilterChange("departmentId", value)
                  }
                >
                  <SelectTrigger id="departmentId" className="border-[#0060AC]">
                    <SelectValue placeholder="Выберите отделение" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="admissionYear" className="text-[#0060AC]">
                  Год поступления
                </Label>
                <Input
                  id="admissionYear"
                  type="number"
                  placeholder="Введите год"
                  value={filters.admissionYear}
                  onChange={(e) =>
                    handleFilterChange("admissionYear", e.target.value)
                  }
                  className="border-[#0060AC] focus:ring-[#0060AC]"
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Button
              onClick={() => router.push("/students/add")}
              className="bg-[#E41613] hover:bg-[#C41411] text-white"
            >
              Добавить студента
            </Button>
          </div>
          {students.length === 0 ? (
            <p className="text-[#0060AC]">Студенты не найдены</p>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <Card key={student._id} className="border-[#0060AC]/30">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-[#0060AC]">
                          {`${student.lastName} ${student.firstName} ${
                            student.middleName || ""
                          }`}
                        </p>
                        <p>Группа: {student.group || "-"}</p>
                        <p>
                          Отделение:{" "}
                          {departments.find(
                            (d) => d._id === student.departmentId
                          )?.name || "-"}
                        </p>
                        <p>Год поступления: {student.admissionYear || "-"}</p>
                      </div>
                      <Link href={`/students/${student._id}`}>
                        <Button className="bg-[#0060AC] hover:bg-[#004080] text-white">
                          Подробности
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
