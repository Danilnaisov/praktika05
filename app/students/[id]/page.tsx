"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentForm from "@/components/StudentForm";
import useDepartments from "@/hooks/useDepartments";
import useAuth from "@/hooks/useAuth";
import { Student } from "@/types/student";
import Link from "next/link";

export default function StudentDetail() {
  const { id } = useParams() as { id: string };
  const { user, loading: authLoading } = useAuth();
  const { departments, error: deptError } = useDepartments();
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const fetchStudent = useCallback(async () => {
    if (!id) {
      setError("ID студента не указан");
      return;
    }
    try {
      const res = await fetch(`/api/students/${id}`);
      const data = await res.json();
      if (res.ok && data && data._id) {
        setStudent({
          ...data,
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString().split("T")[0]
            : "",
          departmentId: data.departmentId?._id || data.departmentId,
        });
      } else {
        setError(data.error || "Студент не найден");
      }
    } catch {
      setError("Не удалось загрузить данные студента");
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      fetchStudent();
    }
  }, [user, id, fetchStudent]);

  const handleSubmit = useCallback(
    async (formData: Partial<Student>, subGroup: string) => {
      try {
        const res = await fetch(`/api/students/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            departmentId: formData.departmentId
              ? { _id: formData.departmentId }
              : undefined,
            birthDate: formData.birthDate
              ? new Date(formData.birthDate).toISOString()
              : undefined,
            admissionYear: formData.admissionYear
              ? Number(formData.admissionYear)
              : undefined,
            graduationYear: formData.graduationYear
              ? Number(formData.graduationYear)
              : undefined,
            gender: formData.gender || undefined,
          }),
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Ошибка при обновлении");
        }
        alert("Студент обновлён");
        setIsEditing(false);
        await fetchStudent();
      } catch (err) {
        throw new Error(err.message || "Ошибка при обновлении");
      }
    },
    [id, fetchStudent]
  );

  const handleDelete = useCallback(async () => {
    if (!confirm("Вы уверены, что хотите удалить студента?")) return;
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        alert("Студент удалён");
        router.push("/students");
      } else {
        setError(result.error || "Ошибка при удалении");
      }
    } catch {
      setError("Не удалось удалить студента");
    }
  }, [id, router]);

  if (authLoading || !user) return null;
  if (error) return <p className="text-[#E41613]">{error}</p>;
  if (deptError) return <p className="text-[#E41613]">{deptError}</p>;
  if (!student) return <p className="text-[#0060AC]">Загрузка...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#9EA1A2]/20 rounded-xl shadow-lg">
      {isEditing ? (
        <StudentForm
          initialData={student}
          departments={departments}
          onSubmit={handleSubmit}
          submitButtonText="Сохранить изменения"
          isEditing
        />
      ) : (
        <Card className="bg-white/80 border-[#0060AC]/30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#0060AC]">
              {`${student.lastName} ${student.firstName} ${
                student.middleName || ""
              }`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong className="text-[#0060AC]">Дата рождения:</strong>{" "}
              {student.birthDate
                ? new Date(student.birthDate).toLocaleDateString("ru-RU")
                : "-"}
            </div>
            <div>
              <strong className="text-[#0060AC]">Группа:</strong>{" "}
              {student.group || "-"}
            </div>
            <div>
              <strong className="text-[#0060AC]">Телефон:</strong>{" "}
              {student.phone || "-"}
            </div>
            <div>
              <strong className="text-[#0060AC]">Финансирование:</strong>{" "}
              {student.funding || "-"}
            </div>
            <div>
              <strong className="text-[#0060AC]">Образование:</strong>{" "}
              {student.education || "-"}
            </div>
            <div>
              <strong className="text-[#0060AC]">Отделение:</strong>{" "}
              {departments.find((d) => d._id === student.departmentId)?.name ||
                "-"}
            </div>
            <div>
              <strong className="text-[#0060AC]">Год поступления:</strong>{" "}
              {student.admissionYear || "-"}
            </div>
            <div>
              <strong className="text-[#0060AC]">Год выпуска:</strong>{" "}
              {student.graduationYear || "-"}
            </div>
            <div>
              <strong className="text-[#0060AC]">Пол:</strong>{" "}
              {student.gender || "-"}
            </div>
            <div>
              <strong className="text-[#0060AC]">
                Информация об отчислении:
              </strong>{" "}
              {student.expulsionInfo || "-"}
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#E41613] hover:bg-[#C41411] text-white"
              >
                Редактировать
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-[#0060AC] hover:bg-[#004080] text-white"
              >
                Удалить
              </Button>
              <Link href="/students">
                <Button className="bg-[#9EA1A2] hover:bg-[#7E8182] text-white">
                  Назад
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
