/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Student {
  _id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  group: string;
  departmentId?: { name: string };
  admissionYear?: number;
}

interface StudentsTableProps {
  filters: Record<string, string | boolean>;
  token: string | null;
}

export default function StudentsTable({ filters, token }: StudentsTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value.toString());
        });

        const response = await fetch(`/api/students?${params}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error("Не удалось загрузить студентов");
        const data = await response.json();
        setStudents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchStudents();
  }, [filters, token]);

  if (loading) return <div className="text-center p-4">Загрузка...</div>;
  if (error)
    return <div className="text-center p-4 text-red-600">Ошибка: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      {students.map((student) => (
        <div
          key={student._id}
          className="bg-white border border-[#B0CDE4] rounded-2xl p-4 flex flex-col justify-between"
        >
          <div>
            <div className="text-base font-bold text-[#0060AC] mb-1">
              {student.lastName} {student.firstName} {student.middleName}
            </div>
            <div className="text-[#737373] text-sm mb-0.5">
              <span className="font-semibold">Группа:</span> {student.group}
            </div>
            {"departmentId" in student && student.departmentId && (
              <div className="text-[#737373] text-sm mb-0.5">
                <span className="font-semibold">Отделение:</span>{" "}
                {student.departmentId.name}
              </div>
            )}
            {"admissionYear" in student && student.admissionYear && (
              <div className="text-[#737373] text-sm mb-0.5">
                <span className="font-semibold">Год поступления:</span>{" "}
                {student.admissionYear}
              </div>
            )}
          </div>
          <div className="flex justify-end mt-3">
            <Link
              href={`/students/${student._id}`}
              className="bg-[#0060AC] hover:bg-[#00518e] text-white font-semibold rounded-lg px-4 py-1.5 text-sm transition-colors"
            >
              Подробнее
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
