"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/student";
import FormField from "./FormField";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

type StudentFormProps = {
  initialData: Partial<Student>;
  departments: { _id: string; name: string; code: string }[];
  onSubmit: (data: Partial<Student>, subGroup: string) => Promise<void>;
  submitButtonText: string;
  isEditing?: boolean;
};

export default function StudentForm({
  initialData,
  departments,
  onSubmit,
  submitButtonText,
  isEditing = false,
}: StudentFormProps) {
  const [formData, setFormData] = useState<Partial<Student>>(initialData);
  const [formData2, setFormData2] = useState({
    subGroup: initialData.group?.split("-")[2] || "1",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const years = Array.from(
    { length: 2030 - 2000 + 1 },
    (_, i) => 2000 + i
  ).reverse();

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
    if (!formData.admissionYear)
      newErrors.admissionYear = "Год поступления обязателен";
    else if (!/^\d{4}$/.test(formData.admissionYear.toString()))
      newErrors.admissionYear = "Год поступления: 4 цифры";
    if (!formData.education) newErrors.education = "Образование обязательно";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData, formData2.subGroup);
      setErrors({});
    } catch (error) {
      setSubmitError(error.message || "Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof Student, value: string | number) => {
    if (key === "phone") {
      const formattedPhone = formatPhoneNumber(value as string);
      setFormData((prev) => ({ ...prev, [key]: formattedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const generateGroup = () => {
    if (formData.departmentId && formData.admissionYear) {
      const dept = departments.find((d) => d._id === formData.departmentId);
      const year = formData.admissionYear?.toString().slice(-2);
      if (dept && year) {
        return `${dept.code}-${year}-${formData2.subGroup || "1"}`;
      }
    }
    return formData.group || "";
  };

  const handleSubGroupChange = (value: string) => {
    setFormData2({ subGroup: value });
    setFormData((prev) => ({ ...prev, group: generateGroup() }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#9EA1A2]/20 rounded-xl shadow-lg">
      <Card className="bg-white/80 border-[#0060AC]/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#0060AC]">
            {isEditing ? "Редактировать студента" : "Добавить студента"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="lastName"
              label="Фамилия *"
              type="text"
              placeholder="Введите фамилию"
              value={formData.lastName || ""}
              onChange={(value) => handleInputChange("lastName", value)}
              error={errors.lastName}
            />
            <FormField
              id="firstName"
              label="Имя *"
              type="text"
              placeholder="Введите имя"
              value={formData.firstName || ""}
              onChange={(value) => handleInputChange("firstName", value)}
              error={errors.firstName}
            />
            <FormField
              id="middleName"
              label="Отчество"
              type="text"
              placeholder="Введите отчество"
              value={formData.middleName || ""}
              onChange={(value) => handleInputChange("middleName", value)}
            />
            <FormField
              id="birthDate"
              label="Дата рождения *"
              type="date"
              value={formData.birthDate || ""}
              onChange={(value) => handleInputChange("birthDate", value)}
              error={errors.birthDate}
            />
            <FormField
              id="departmentId"
              label="Отделение *"
              type="select"
              value={formData.departmentId || ""}
              onChange={(value) => handleInputChange("departmentId", value)}
              error={errors.departmentId}
              options={departments.map((dept) => ({
                value: dept._id,
                label: dept.name,
              }))}
              placeholder="Выберите отделение"
            />
            <FormField
              id="admissionYear"
              label="Год поступления *"
              type="select"
              value={formData.admissionYear?.toString() || ""}
              onChange={(value) =>
                handleInputChange("admissionYear", Number(value))
              }
              error={errors.admissionYear}
              options={years.map((year) => ({
                value: year.toString(),
                label: year.toString(),
              }))}
              placeholder="Выберите год"
            />
            <FormField
              id="subGroup"
              label="Подгруппа *"
              type="select"
              value={formData2.subGroup}
              onChange={handleSubGroupChange}
              options={["1", "2", "3", "4"].map((sub) => ({
                value: sub,
                label: sub,
              }))}
              placeholder="Выберите подгруппу"
            />
            <FormField
              id="group"
              label="Группа *"
              type="text"
              value={formData.group || ""}
              readOnly
              error={errors.group}
            />
            <FormField
              id="phone"
              label="Телефон *"
              type="tel"
              placeholder="+7 (XXX)-XXX-XX-XX"
              value={formData.phone || ""}
              onChange={(value) => handleInputChange("phone", value)}
              error={errors.phone}
            />
            <FormField
              id="funding"
              label="Финансирование *"
              type="select"
              value={formData.funding || ""}
              onChange={(value) => handleInputChange("funding", value)}
              error={errors.funding}
              options={[
                { value: "Бюджет", label: "Бюджет" },
                { value: "Контракт", label: "Контракт" },
                { value: "Платное", label: "Платное" },
              ]}
              placeholder="Выберите финансирование"
            />
            <FormField
              id="education"
              label="Образование *"
              type="select"
              value={formData.education || ""}
              onChange={(value) => handleInputChange("education", value)}
              error={errors.education}
              options={[
                { value: "9 кл.", label: "9 кл." },
                { value: "11 кл.", label: "11 кл." },
                { value: "СПО", label: "СПО" },
                { value: "ВО", label: "ВО" },
              ]}
              placeholder="Выберите образование"
            />
            <FormField
              id="gender"
              label="Пол"
              type="select"
              value={formData.gender || ""}
              onChange={(value) => handleInputChange("gender", value)}
              options={[
                { value: "Мужской", label: "Мужской" },
                { value: "Женский", label: "Женский" },
              ]}
              placeholder="Выберите пол"
            />
            <FormField
              id="graduationYear"
              label="Год выпуска"
              type="select"
              value={formData.graduationYear?.toString() || ""}
              onChange={(value) =>
                handleInputChange("graduationYear", Number(value))
              }
              options={years.map((year) => ({
                value: year.toString(),
                label: year.toString(),
              }))}
              placeholder="Выберите год выпуска"
            />
            <FormField
              id="expulsionInfo"
              label="Информация об отчислении"
              type="text"
              placeholder="Введите информацию об отчислении"
              value={formData.expulsionInfo || ""}
              onChange={(value) => handleInputChange("expulsionInfo", value)}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E41613] hover:bg-[#C41411] text-white disabled:opacity-50"
            >
              {loading ? "Сохранение..." : submitButtonText}
            </Button>
            {submitError && (
              <p className="text-[#E41613] text-sm text-center">
                {submitError}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
