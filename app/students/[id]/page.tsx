"use client";

import { useState, useEffect } from "react";
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
import { Student } from "@/types/student";
import { getAuthUser } from "@/lib/auth";

export default function StudentDetail({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [departments, setDepartments] = useState<
    { _id: string; name: string }[]
  >([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const user = getAuthUser();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students/${params.id}`);
        if (!res.ok) throw new Error("Студент не найден");
        const data = await res.json();
        setStudent(data);
        setFormData({
          lastName: data.lastName,
          firstName: data.firstName,
          middleName: data.middleName,
          birthDate: data.birthDate.split("T")[0],
          group: data.group,
          phone: data.phone,
          funding: data.funding,
          education: data.education,
          departmentId: data.departmentId?._id,
          admissionYear: data.admissionYear,
          expulsionInfo: data.expulsionInfo,
        });
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        setDepartments(data);
      } catch {
        setSubmitError("Не удалось загрузить отделения");
      }
    };

    fetchStudent();
    fetchDepartments();
  }, [params.id, router]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Student, string>> = {};
    if (!formData.lastName) newErrors.lastName = "Фамилия обязательна";
    if (!formData.firstName) newErrors.firstName = "Имя обязательно";
    if (!formData.birthDate) newErrors.birthDate = "Дата рождения обязательна";
    else if (new Date(formData.birthDate) >= new Date())
      newErrors.birthDate = "Дата рождения должна быть в прошлом";
    if (!formData.group) newErrors.group = "Группа обязательна";
    if (!formData.phone) newErrors.phone = "Телефон обязателен";
    else if (!/^\+7 \(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(formData.phone))
      newErrors.phone = "Формат: +7 (XXX)-XXX-XX-XX";
    if (!formData.funding) newErrors.funding = "Финансирование обязательно";
    if (!formData.departmentId)
      newErrors.departmentId = "Отделение обязательно";
    if (
      formData.admissionYear &&
      !/^\d{4}$/.test(formData.admissionYear.toString())
    )
      newErrors.admissionYear = "Год поступления: 4 цифры";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/students/${params.id}`, {
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
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setStudent(result);
        setIsEditing(false);
        alert("Студент обновлён");
      } else {
        setSubmitError(result.error || "Ошибка при обновлении");
      }
    } catch {
      setSubmitError("Не удалось обновить студента");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить студента?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/students/${params.id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        alert("Студент удалён");
        router.push("/students");
      } else {
        setSubmitError(result.error || "Ошибка при удалении");
      }
    } catch {
      setSubmitError("Не удалось удалить студента");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof Student, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (loading) return <p className="text-[#0060AC] text-center">Загрузка...</p>;
  if (submitError && !student)
    return <p className="text-[#E41613] text-center">{submitError}</p>;
  if (!student)
    return <p className="text-[#0060AC] text-center">Студент не найден</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#9EA1A2]/20 rounded-xl shadow-lg">
      <Card className="bg-white/80 border-[#0060AC]/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#0060AC]">
            {isEditing
              ? "Редактировать студента"
              : `${student.lastName} ${student.firstName} ${student.middleName}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="lastName" className="text-[#0060AC]">
                  Фамилия *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={`border-[#0060AC] focus:ring-[#0060AC] ${
                    errors.lastName ? "border-[#E41613]" : ""
                  }`}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-[#E41613] text-sm">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="firstName" className="text-[#0060AC]">
                  Имя *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`border-[#0060AC] focus:ring-[#0060AC] ${
                    errors.firstName ? "border-[#E41613]" : ""
                  }`}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-[#E41613] text-sm">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="middleName" className="text-[#0060AC]">
                  Отчество
                </Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) =>
                    handleInputChange("middleName", e.target.value)
                  }
                  className="border-[#0060AC] focus:ring-[#0060AC]"
                />
              </div>
              <div>
                <Label htmlFor="birthDate" className="text-[#0060AC]">
                  Дата рождения *
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  className={`border-[#0060AC] focus:ring-[#0060AC] ${
                    errors.birthDate ? "border-[#E41613]" : ""
                  }`}
                  aria-invalid={!!errors.birthDate}
                  aria-describedby={
                    errors.birthDate ? "birthDate-error" : undefined
                  }
                />
                {errors.birthDate && (
                  <p id="birthDate-error" className="text-[#E41613] text-sm">
                    {errors.birthDate}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="group" className="text-[#0060AC]">
                  Группа *
                </Label>
                <Input
                  id="group"
                  value={formData.group}
                  onChange={(e) => handleInputChange("group", e.target.value)}
                  className={`border-[#0060AC] focus:ring-[#0060AC] ${
                    errors.group ? "border-[#E41613]" : ""
                  }`}
                  aria-invalid={!!errors.group}
                  aria-describedby={errors.group ? "group-error" : undefined}
                />
                {errors.group && (
                  <p id="group-error" className="text-[#E41613] text-sm">
                    {errors.group}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="text-[#0060AC]">
                  Телефон *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`border-[#0060AC] focus:ring-[#0060AC] ${
                    errors.phone ? "border-[#E41613]" : ""
                  }`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-[#E41613] text-sm">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="funding" className="text-[#0060AC]">
                  Финансирование *
                </Label>
                <Select
                  value={formData.funding}
                  onValueChange={(value) => handleInputChange("funding", value)}
                >
                  <SelectTrigger
                    id="funding"
                    className={`border-[#0060AC] ${
                      errors.funding ? "border-[#E41613]" : ""
                    }`}
                    aria-invalid={!!errors.funding}
                    aria-describedby={
                      errors.funding ? "funding-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Выберите финансирование" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Бюджет">Бюджет</SelectItem>
                    <SelectItem value="Контракт">Контракт</SelectItem>
                  </SelectContent>
                </Select>
                {errors.funding && (
                  <p id="funding-error" className="text-[#E41613] text-sm">
                    {errors.funding}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="education" className="text-[#0060AC]">
                  Образование
                </Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  className="border-[#0060AC] focus:ring-[#0060AC]"
                />
              </div>
              <div>
                <Label htmlFor="departmentId" className="text-[#0060AC]">
                  Отделение *
                </Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) =>
                    handleInputChange("departmentId", value)
                  }
                >
                  <SelectTrigger
                    id="departmentId"
                    className={`border-[#0060AC] ${
                      errors.departmentId ? "border-[#E41613]" : ""
                    }`}
                    aria-invalid={!!errors.departmentId}
                    aria-describedby={
                      errors.departmentId ? "departmentId-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Выберите отделение" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departmentId && (
                  <p id="departmentId-error" className="text-[#E41613] text-sm">
                    {errors.departmentId}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="admissionYear" className="text-[#0060AC]">
                  Год поступления
                </Label>
                <Input
                  id="admissionYear"
                  type="number"
                  value={formData.admissionYear || ""}
                  onChange={(e) =>
                    handleInputChange("admissionYear", Number(e.target.value))
                  }
                  className={`border-[#0060AC] focus:ring-[#0060AC] ${
                    errors.admissionYear ? "border-[#E41613]" : ""
                  }`}
                  aria-invalid={!!errors.admissionYear}
                  aria-describedby={
                    errors.admissionYear ? "admissionYear-error" : undefined
                  }
                />
                {errors.admissionYear && (
                  <p
                    id="admissionYear-error"
                    className="text-[#E41613] text-sm"
                  >
                    {errors.admissionYear}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="expulsionInfo" className="text-[#0060AC]">
                  Информация об отчислении
                </Label>
                <Input
                  id="expulsionInfo"
                  value={formData.expulsionInfo}
                  onChange={(e) =>
                    handleInputChange("expulsionInfo", e.target.value)
                  }
                  className="border-[#0060AC] focus:ring-[#0060AC]"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E41613] hover:bg-[#C41411] text-white disabled:opacity-50"
                >
                  {loading ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-[#9EA1A2] hover:bg-[#8A9092] text-white"
                >
                  Отмена
                </Button>
              </div>
              {submitError && (
                <p className="text-[#E41613] text-sm text-center">
                  {submitError}
                </p>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-[#0060AC] font-semibold">ФИО</Label>
                <p>{`${student.lastName} ${student.firstName} ${
                  student.middleName || "-"
                }`}</p>
              </div>
              <div>
                <Label className="text-[#0060AC] font-semibold">
                  Дата рождения
                </Label>
                <p>{new Date(student.birthDate).toLocaleDateString("ru-RU")}</p>
              </div>
              <div>
                <Label className="text-[#0060AC] font-semibold">Группа</Label>
                <p>{student.group}</p>
              </div>
              <div>
                <Label className="text-[#0060AC] font-semibold">Телефон</Label>
                <p>{student.phone}</p>
              </div>
              <div>
                <Label className="text-[#0060AC] font-semibold">
                  Финансирование
                </Label>
                <p>{student.funding}</p>
              </div>
              <div>
                <Label className="text-[#0060AC] font-semibold">
                  Образование
                </Label>
                <p>{student.education || "-"}</p>
              </div>
              <div>
                <Label className="text-[#0060AC] font-semibold">
                  Отделение
                </Label>
                <p>{student.departmentId?.name || "-"}</p>
              </div>
              <div>
                <Label className="text-[#0060AC] font-semibold">
                  Год поступления
                </Label>
                <p>{student.admissionYear || "-"}</p>
              </div>
              <div>
                <Label className="text-[#0060AC] font-semibold">
                  Информация об отчислении
                </Label>
                <p>{student.expulsionInfo || "-"}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#E41613] hover:bg-[#C41411] text-white"
                >
                  Редактировать
                </Button>
                {user?.role === "Admin" && (
                  <Button
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-full bg-[#9EA1A2] hover:bg-[#8A9092] text-white disabled:opacity-50"
                  >
                    {loading ? "Удаление..." : "Удалить"}
                  </Button>
                )}
              </div>
              {submitError && (
                <p className="text-[#E41613] text-sm text-center">
                  {submitError}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
