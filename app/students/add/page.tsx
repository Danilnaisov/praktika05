"use client";

import { useCallback } from "react";
import StudentForm from "@/components/StudentForm";
import useDepartments from "@/hooks/useDepartments";
import useAuth from "@/hooks/useAuth";
import { Student } from "@/types/student";

export default function AddStudent() {
  const { user, loading } = useAuth();
  const { departments, error: deptError } = useDepartments();

  const handleSubmit = useCallback(
    async (formData: Partial<Student>, subGroup: string) => {
      const res = await fetch("/api/students", {
        method: "POST",
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
        throw new Error(result.error || "Ошибка при добавлении");
      }
      alert("Студент добавлен");
    },
    []
  );

  if (loading || !user) return null;
  if (deptError) return <p className="text-[#E41613]">{deptError}</p>;

  return (
    <StudentForm
      initialData={{
        lastName: "",
        firstName: "",
        middleName: "",
        birthDate: "",
        group: "",
        phone: "",
        funding: "",
        education: "",
        departmentId: undefined,
        admissionYear: undefined,
        graduationYear: undefined,
        gender: undefined,
        expulsionInfo: "",
      }}
      departments={departments}
      onSubmit={handleSubmit}
      submitButtonText="Добавить студента"
    />
  );
}
