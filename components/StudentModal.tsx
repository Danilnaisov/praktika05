/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
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
import { FileUpload } from "@/components/FileUpload";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { IStudent } from "@/types";

interface FileData {
  url: string;
  fileId: string;
}

interface StudentData {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  gender: string;
  phone: string;
  education: string;
  departmentId: string;
  group: string;
  funding: string;
  admissionYear: string;
  graduationYear: string;
  expulsionInfo: string;
  expulsionDate: string;
  note: string;
  orphanOrder: string;
  orphanStart: string;
  orphanEnd: string;
  orphanNote: string;
  orphanFiles: FileData[];
  disabledOrder: string;
  disabledStart: string;
  disabledEnd: string;
  disabledNote: string;
  disabledType: string;
  disabledFiles: FileData[];
  ovzOrder: string;
  ovzStart: string;
  ovzEnd: string;
  ovzNote: string;
  ovzFiles: FileData[];
  dormitoryRoom: string;
  dormitoryStart: string;
  dormitoryEnd: string;
  dormitoryNote: string;
  dormitoryFiles: FileData[];
  riskSopType: string;
  riskSopStartReason: string;
  riskSopStartBasis: string;
  riskSopStartDate: string;
  riskSopEndReason: string;
  riskSopEndBasis: string;
  riskSopEndDate: string;
  riskSopNote: string;
  spppDates: Array<{
    date: string;
    staff: string;
    representatives: string;
    reason: string;
    decision: string;
    note: string;
  }>;
  svoDoc: FileData[];
  svoStart: string;
  svoEnd: string;
  svoDocument: string;
  scholarshipDoc: FileData[];
  scholarshipStart: string;
  scholarshipEnd: string;
  scholarshipDocument: string;
}

interface Room {
  _id: string;
  name: string;
  capacity: number;
  students?: string[];
}

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: IStudent;
  mode: "add" | "edit";
}

export default function StudentModal({
  isOpen,
  onClose,
  student,
  mode,
}: StudentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [studentData, setStudentData] = useState<StudentData>({
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    gender: "",
    phone: "",
    education: "",
    departmentId: "",
    group: "",
    funding: "",
    admissionYear: "",
    graduationYear: "",
    expulsionInfo: "",
    expulsionDate: "",
    note: "",
    orphanOrder: "",
    orphanStart: "",
    orphanEnd: "",
    orphanNote: "",
    orphanFiles: [],
    disabledOrder: "",
    disabledStart: "",
    disabledEnd: "",
    disabledNote: "",
    disabledType: "",
    disabledFiles: [],
    ovzOrder: "",
    ovzStart: "",
    ovzEnd: "",
    ovzNote: "",
    ovzFiles: [],
    dormitoryRoom: "",
    dormitoryStart: "",
    dormitoryEnd: "",
    dormitoryNote: "",
    dormitoryFiles: [],
    riskSopType: "",
    riskSopStartReason: "",
    riskSopStartBasis: "",
    riskSopStartDate: "",
    riskSopEndReason: "",
    riskSopEndBasis: "",
    riskSopEndDate: "",
    riskSopNote: "",
    spppDates: [
      {
        date: "",
        staff: "",
        representatives: "",
        reason: "",
        decision: "",
        note: "",
      },
    ],
    svoDoc: [],
    svoStart: "",
    svoEnd: "",
    svoDocument: "",
    scholarshipDoc: [],
    scholarshipStart: "",
    scholarshipEnd: "",
    scholarshipDocument: "",
  });
  const [departments, setDepartments] = useState<
    { _id: string; name: string }[]
  >([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const steps = [
    { step: 1, title: "Студенты" },
    { step: 2, title: "Сироты" },
    { step: 3, title: "Инвалиды" },
    { step: 4, title: "ОВЗ" },
    { step: 5, title: "Общежитие" },
    { step: 6, title: "Группа риска/СОП" },
    { step: 7, title: "СППП" },
    { step: 8, title: "СВО" },
    { step: 9, title: "Социальная стипендия" },
  ];

  // Инициализация данных при редактировании
  useEffect(() => {
    if (mode === "edit" && student) {
      setStudentData({
        ...studentData,
        lastName: student.lastName || "",
        firstName: student.firstName || "",
        middleName: student.middleName || "",
        birthDate: student.birthDate
          ? new Date(student.birthDate).toISOString().split("T")[0]
          : "",
        gender: student.gender || "",
        phone: student.phone || "",
        education: student.education || "",
        departmentId: student.departmentId?._id?.toString() || "",
        group: student.group || "",
        funding: student.funding || "",
        admissionYear: student.admissionYear?.toString() || "",
        graduationYear: student.graduationYear?.toString() || "",
        expulsionInfo: student.expulsionInfo || "",
        expulsionDate: student.expulsionDate
          ? new Date(student.expulsionDate).toISOString().split("T")[0]
          : "",
        note: student.note || "",
        orphanOrder: student.orphanStatus?.order || "",
        orphanStart: student.orphanStatus?.startDate
          ? new Date(student.orphanStatus.startDate).toISOString().split("T")[0]
          : "",
        orphanEnd: student.orphanStatus?.endDate
          ? new Date(student.orphanStatus.endDate).toISOString().split("T")[0]
          : "",
        orphanNote: student.orphanStatus?.note || "",
        orphanFiles:
          student.orphanStatus?.files?.map((file) => ({
            url: file.path,
            fileId: file._id.toString(),
          })) || [],
        disabledOrder: student.disabilityStatus?.order || "",
        disabledStart: student.disabilityStatus?.startDate
          ? new Date(student.disabilityStatus.startDate)
              .toISOString()
              .split("T")[0]
          : "",
        disabledEnd: student.disabilityStatus?.endDate
          ? new Date(student.disabilityStatus.endDate)
              .toISOString()
              .split("T")[0]
          : "",
        disabledNote: student.disabilityStatus?.note || "",
        disabledType: student.disabilityStatus?.disabilityType || "",
        disabledFiles:
          student.disabilityStatus?.files?.map((file) => ({
            url: file.path,
            fileId: file._id.toString(),
          })) || [],
        ovzOrder: student.ovzStatus?.order || "",
        ovzStart: student.ovzStatus?.startDate
          ? new Date(student.ovzStatus.startDate).toISOString().split("T")[0]
          : "",
        ovzEnd: student.ovzStatus?.endDate
          ? new Date(student.ovzStatus.endDate).toISOString().split("T")[0]
          : "",
        ovzNote: student.ovzStatus?.note || "",
        ovzFiles:
          student.ovzStatus?.files?.map((file) => ({
            url: file.path,
            fileId: file._id.toString(),
          })) || [],
        dormitoryRoom: student?.dormitory?.roomId?._id?.toString() || "",
        dormitoryStart: student?.dormitory?.startDate
          ? new Date(student.dormitory.startDate).toISOString().split("T")[0]
          : "",
        dormitoryEnd: student?.dormitory?.endDate
          ? new Date(student.dormitory.endDate).toISOString().split("T")[0]
          : "",
        dormitoryNote: student?.dormitory?.note || "",
        dormitoryFiles:
          student?.dormitory?.files?.map((file) => ({
            url: file.path,
            fileId: file._id.toString(),
          })) || [],
        riskSopType:
          student.riskGroupSop?.type === "sop"
            ? "СОП"
            : student.riskGroupSop?.type === "risk"
            ? "Группа риска"
            : "",
        riskSopStartReason: student.riskGroupSop?.reason || "",
        riskSopStartBasis: student.riskGroupSop?.basis || "",
        riskSopStartDate: student.riskGroupSop?.startDate
          ? new Date(student.riskGroupSop.startDate).toISOString().split("T")[0]
          : "",
        riskSopEndReason: student.riskGroupSop?.endReason || "",
        riskSopEndBasis: student.riskGroupSop?.endBasis || "",
        riskSopEndDate: student.riskGroupSop?.endDate
          ? new Date(student.riskGroupSop.endDate).toISOString().split("T")[0]
          : "",
        riskSopNote: student.riskGroupSop?.note || "",
        spppDates: student.sppp?.map((meeting) => ({
          date: meeting.date
            ? new Date(meeting.date).toISOString().split("T")[0]
            : "",
          staff: meeting.attendeesEmployees || "",
          representatives: meeting.attendeesRepresentatives || "",
          reason: meeting.reason || "",
          decision: meeting.decision || "",
          note: meeting.note || "",
        })) || [
          {
            date: "",
            staff: "",
            representatives: "",
            reason: "",
            decision: "",
            note: "",
          },
        ],
        svoDoc:
          student.svoStatus?.files?.map((file) => ({
            url: file.path,
            fileId: file._id.toString(),
          })) || [],
        svoStart: student.svoStatus?.startDate
          ? new Date(student.svoStatus.startDate).toISOString().split("T")[0]
          : "",
        svoEnd: student.svoStatus?.endDate
          ? new Date(student.svoStatus.endDate).toISOString().split("T")[0]
          : "",
        svoDocument: student.svoStatus?.note || "",
        scholarshipDoc:
          student.socialScholarship?.files?.map((file) => ({
            url: file.path,
            fileId: file._id.toString(),
          })) || [],
        scholarshipStart: student.socialScholarship?.startDate
          ? new Date(student.socialScholarship.startDate)
              .toISOString()
              .split("T")[0]
          : "",
        scholarshipEnd: student.socialScholarship?.endDate
          ? new Date(student.socialScholarship.endDate)
              .toISOString()
              .split("T")[0]
          : "",
        scholarshipDocument: student.socialScholarship?.note || "",
      });
    }
  }, [student, mode]);

  // Загрузка отделений и комнат
  useEffect(() => {
    if (!isOpen) return;

    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Не удалось загрузить отделения");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Ошибка при загрузке отделений:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Ошибка при загрузке комнат");
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Ошибка при загрузке комнат:", error);
      }
    };

    fetchDepartments();
    fetchRooms();
  }, [isOpen]);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, "");
    if (cleaned.length <= 1) return `+7 (${cleaned}`;
    if (cleaned.length <= 4) return `+7 (${cleaned.slice(1, 4)}`;
    if (cleaned.length <= 7)
      return `+7 (${cleaned.slice(1, 4)})-${cleaned.slice(4, 7)}`;
    if (cleaned.length <= 9)
      return `+7 (${cleaned.slice(1, 4)})-${cleaned.slice(
        4,
        7
      )}-${cleaned.slice(7, 9)}`;
    return `+7 (${cleaned.slice(1, 4)})-${cleaned.slice(4, 7)}-${cleaned.slice(
      7,
      9
    )}-${cleaned.slice(9, 11)}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setStudentData((prev) => ({ ...prev, [name]: formatPhone(value) }));
    } else if (name === "admissionYear" || name === "graduationYear") {
      const numValue = value.replace(/[^0-9]/g, "").slice(0, 4);
      setStudentData((prev) => ({ ...prev, [name]: numValue }));
    } else if (
      name === "lastName" ||
      name === "firstName" ||
      name === "middleName"
    ) {
      const lettersOnly = value.replace(/[^а-яА-ЯёЁa-zA-Z\s-]/g, "");
      setStudentData((prev) => ({ ...prev, [name]: lettersOnly }));
    } else {
      setStudentData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (name: string) => (files: string[]) => {
    setStudentData((prev) => ({
      ...prev,
      [name]: files.map((file) => {
        const [url, fileId] = file.split("|");
        return { url, fileId };
      }),
    }));
  };

  const handleSpppChange = (index: number, field: string, value: string) => {
    const newSpppDates = [...studentData.spppDates];
    newSpppDates[index] = { ...newSpppDates[index], [field]: value };
    setStudentData((prev) => ({ ...prev, spppDates: newSpppDates }));
  };

  const addSpppMeeting = () => {
    setStudentData((prev) => ({
      ...prev,
      spppDates: [
        ...prev.spppDates,
        {
          date: "",
          staff: "",
          representatives: "",
          reason: "",
          decision: "",
          note: "",
        },
      ],
    }));
  };

  const removeSpppMeeting = (index: number) => {
    const newSpppDates = studentData.spppDates.filter((_, i) => i !== index);
    setStudentData((prev) => ({ ...prev, spppDates: newSpppDates }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 9));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!student && mode === "edit") {
      alert("Ошибка: студент не найден");
      return;
    }

    const requiredFields = {
      lastName: studentData.lastName,
      firstName: studentData.firstName,
      middleName: studentData.middleName,
      birthDate: studentData.birthDate,
      gender: studentData.gender,
      phone: studentData.phone,
      education: studentData.education,
      departmentId: studentData.departmentId,
      group: studentData.group,
      funding: studentData.funding,
      admissionYear: studentData.admissionYear,
      graduationYear: studentData.graduationYear,
    };

    // Валидация для Группы риска/СОП
    if (studentData.riskSopType) {
      if (
        !studentData.riskSopStartDate ||
        !studentData.riskSopStartReason ||
        !studentData.riskSopStartBasis
      ) {
        alert(
          "Заполните все обязательные поля для статуса 'Группа риска/СОП': дата постановки, причина постановки, основание постановки"
        );
        return;
      }
    }

    // Валидация для СВО
    if (
      studentData.svoStart ||
      studentData.svoEnd ||
      studentData.svoDoc.length > 0
    ) {
      if (!studentData.svoStart) {
        alert("Заполните дату начала статуса СВО");
        return;
      }
    }

    // Валидация для СППП
    if (Array.isArray(studentData.spppDates)) {
      for (const [i, meeting] of studentData.spppDates.entries()) {
        if (
          meeting.date ||
          meeting.staff ||
          meeting.representatives ||
          meeting.reason ||
          meeting.decision
        ) {
          if (
            !meeting.date ||
            !meeting.staff ||
            !meeting.representatives ||
            !meeting.reason ||
            !meeting.decision
          ) {
            alert(`Заполните все обязательные поля для встречи СППП №${i + 1}`);
            return;
          }
        }
      }
    }

    if (!Object.values(requiredFields).every(Boolean)) {
      alert("Заполните все обязательные поля");
      return;
    }

    try {
      const url =
        mode === "add" ? "/api/students" : `/api/students/${student?._id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const payload = {
        ...studentData,
        orphanFiles: studentData.orphanFiles,
        disabledFiles: studentData.disabledFiles,
        ovzFiles: studentData.ovzFiles,
        dormitoryFiles: studentData.dormitoryFiles,
        svoDoc: studentData.svoDoc,
        scholarshipDoc: studentData.scholarshipDoc,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(mode === "add" ? "Студент добавлен" : "Студент обновлен");
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Ошибка при сохранении студента:", error);
      alert("Произошла ошибка при сохранении студента");
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setStudentData({
      lastName: "",
      firstName: "",
      middleName: "",
      birthDate: "",
      gender: "",
      phone: "",
      education: "",
      departmentId: "",
      group: "",
      funding: "",
      admissionYear: "",
      graduationYear: "",
      expulsionInfo: "",
      expulsionDate: "",
      note: "",
      orphanOrder: "",
      orphanStart: "",
      orphanEnd: "",
      orphanNote: "",
      orphanFiles: [],
      disabledOrder: "",
      disabledStart: "",
      disabledEnd: "",
      disabledNote: "",
      disabledType: "",
      disabledFiles: [],
      ovzOrder: "",
      ovzStart: "",
      ovzEnd: "",
      ovzNote: "",
      ovzFiles: [],
      dormitoryRoom: "",
      dormitoryStart: "",
      dormitoryEnd: "",
      dormitoryNote: "",
      dormitoryFiles: [],
      riskSopType: "",
      riskSopStartReason: "",
      riskSopStartBasis: "",
      riskSopStartDate: "",
      riskSopEndReason: "",
      riskSopEndBasis: "",
      riskSopEndDate: "",
      riskSopNote: "",
      spppDates: [
        {
          date: "",
          staff: "",
          representatives: "",
          reason: "",
          decision: "",
          note: "",
        },
      ],
      svoDoc: [],
      svoStart: "",
      svoEnd: "",
      svoDocument: "",
      scholarshipDoc: [],
      scholarshipStart: "",
      scholarshipEnd: "",
      scholarshipDocument: "",
    });
  };

  // Фильтрация комнат по свободным местам
  const currentRoomId = studentData.dormitoryRoom;
  const availableRooms = rooms.filter(
    (room: Room) =>
      room._id === currentRoomId ||
      room.capacity - (room.students?.length || 0) > 0
  );

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-[#0060AC]">Фамилия*</Label>
              <Input
                name="lastName"
                value={studentData.lastName}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Имя*</Label>
              <Input
                name="firstName"
                value={studentData.firstName}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Отчество*</Label>
              <Input
                name="middleName"
                value={studentData.middleName}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Дата рождения*</Label>
              <Input
                type="date"
                name="birthDate"
                value={studentData.birthDate}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Пол*</Label>
              <Select
                name="gender"
                value={studentData.gender}
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "gender", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              >
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Выберите пол" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="М">Мужской</SelectItem>
                  <SelectItem value="Ж">Женский</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#0060AC]">Контактный номер*</Label>
              <Input
                name="phone"
                value={studentData.phone}
                onChange={handleInputChange}
                className="w-full"
                placeholder="+7 (XXX)-XXX-XX-XX"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Образование*</Label>
              <Select
                name="education"
                value={studentData.education}
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "education", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              >
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Выберите образование" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9 кл.">9 классов</SelectItem>
                  <SelectItem value="11 кл.">11 классов</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#0060AC]">Отделение*</Label>
              <Select
                name="departmentId"
                value={studentData.departmentId}
                onValueChange={(value) => {
                  setStudentData((prev) => ({
                    ...prev,
                    departmentId: value,
                  }));
                }}
              >
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Выберите отделение" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#0060AC]">Группа*</Label>
              <Input
                name="group"
                value={studentData.group}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Финансирование*</Label>
              <Select
                name="funding"
                value={studentData.funding}
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "funding", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              >
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Выберите финансирование" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Бюджет">Бюджет</SelectItem>
                  <SelectItem value="Внебюджет">Внебюджет</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#0060AC]">Год поступления*</Label>
              <Input
                type="text"
                name="admissionYear"
                value={studentData.admissionYear}
                onChange={handleInputChange}
                className="w-full"
                placeholder="ГГГГ"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Год окончания*</Label>
              <Input
                type="text"
                name="graduationYear"
                value={studentData.graduationYear}
                onChange={handleInputChange}
                className="w-full"
                placeholder="ГГГГ"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Отчисление</Label>
              <Input
                name="expulsionInfo"
                value={studentData.expulsionInfo}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Дата отчисления</Label>
              <Input
                type="date"
                name="expulsionDate"
                value={studentData.expulsionDate}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Примечание</Label>
              <Input
                name="note"
                value={studentData.note}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-[#0060AC]">
                Приказ о присвоении статуса*
              </Label>
              <Input
                name="orphanOrder"
                value={studentData.orphanOrder}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Начало статуса*</Label>
              <Input
                type="date"
                name="orphanStart"
                value={studentData.orphanStart}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Окончание статуса</Label>
              <Input
                type="date"
                name="orphanEnd"
                value={studentData.orphanEnd}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Примечание</Label>
              <Input
                name="orphanNote"
                value={studentData.orphanNote}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[#0060AC]">Документы</Label>
              <FileUpload
                value={studentData.orphanFiles.map(
                  (file) => `${file.url}|${file.fileId}`
                )}
                onChange={handleFileChange("orphanFiles")}
                folder="orphan-files"
                entityId={student?._id || "new"}
                entityType="OrphanStatus"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-[#0060AC]">
                Приказ о присвоении статуса*
              </Label>
              <Input
                name="disabledOrder"
                value={studentData.disabledOrder}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Начало статуса*</Label>
              <Input
                type="date"
                name="disabledStart"
                value={studentData.disabledStart}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Окончание статуса</Label>
              <Input
                type="date"
                name="disabledEnd"
                value={studentData.disabledEnd}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Тип инвалидности*</Label>
              <Input
                name="disabledType"
                value={studentData.disabledType}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Примечание</Label>
              <Input
                name="disabledNote"
                value={studentData.disabledNote}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[#0060AC]">Документы</Label>
              <FileUpload
                value={studentData.disabledFiles.map(
                  (file) => `${file.url}|${file.fileId}`
                )}
                onChange={handleFileChange("disabledFiles")}
                folder="disabled-files"
                entityId={student?._id || "new"}
                entityType="DisabilityStatus"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-[#0060AC]">
                Приказ о присвоении статуса*
              </Label>
              <Input
                name="ovzOrder"
                value={studentData.ovzOrder}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Начало статуса*</Label>
              <Input
                type="date"
                name="ovzStart"
                value={studentData.ovzStart}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Окончание статуса</Label>
              <Input
                type="date"
                name="ovzEnd"
                value={studentData.ovzEnd}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Примечание</Label>
              <Input
                name="ovzNote"
                value={studentData.ovzNote}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[#0060AC]">Документы</Label>
              <FileUpload
                value={studentData.ovzFiles.map(
                  (file) => `${file.url}|${file.fileId}`
                )}
                onChange={handleFileChange("ovzFiles")}
                folder="ovz-files"
                entityId={student?._id || "new"}
                entityType="OvzStatus"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-[#0060AC]">Комната</Label>
              <div className="flex gap-2">
                <Select
                  value={studentData.dormitoryRoom}
                  onValueChange={(value) =>
                    setStudentData({ ...studentData, dormitoryRoom: value })
                  }
                >
                  <SelectTrigger className="w-full text-black">
                    <SelectValue placeholder="Выберите комнату" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((room: Room) => (
                      <SelectItem key={room._id} value={room._id}>
                        {room.name} (Свободно:{" "}
                        {room.capacity - (room.students?.length || 0)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-[#0060AC]">Дата заселения*</Label>
              <Input
                type="date"
                name="dormitoryStart"
                value={studentData.dormitoryStart}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Дата выселения</Label>
              <Input
                type="date"
                name="dormitoryEnd"
                value={studentData.dormitoryEnd}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Примечание</Label>
              <Input
                name="dormitoryNote"
                value={studentData.dormitoryNote}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите текст"
                style={{ color: "#000000" }}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[#0060AC]">Документы</Label>
              <FileUpload
                value={studentData.dormitoryFiles.map(
                  (file) => `${file.url}|${file.fileId}`
                )}
                onChange={handleFileChange("dormitoryFiles")}
                folder="dormitory-files"
                entityId={student?._id || "new"}
                entityType="Dormitory"
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-[#0060AC]">Тип*</Label>
              <Select
                name="riskSopType"
                value={studentData.riskSopType}
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "riskSopType", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              >
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Группа риска">Группа риска</SelectItem>
                  <SelectItem value="СОП">СОП</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#0060AC]">Причина постановки*</Label>
              <Input
                name="riskSopStartReason"
                value={studentData.riskSopStartReason}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите причину"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Основание постановки*</Label>
              <Input
                name="riskSopStartBasis"
                value={studentData.riskSopStartBasis}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите основание"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Дата начала*</Label>
              <Input
                type="date"
                name="riskSopStartDate"
                value={studentData.riskSopStartDate}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Причина снятия</Label>
              <Input
                name="riskSopEndReason"
                value={studentData.riskSopEndReason}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите причину"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Основание снятия</Label>
              <Input
                name="riskSopEndBasis"
                value={studentData.riskSopEndBasis}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Введите основание"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Окончание статуса</Label>
              <Input
                type="date"
                name="svoEnd"
                value={studentData.svoEnd}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            {studentData.spppDates.map((meeting, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg"
              >
                <div>
                  <Label className="text-[#0060AC]">Дата встречи*</Label>
                  <Input
                    type="date"
                    value={meeting.date}
                    onChange={(e) =>
                      handleSpppChange(index, "date", e.target.value)
                    }
                    className="w-full"
                    placeholder="Выберите дату"
                    style={{ color: "#000000" }}
                  />
                </div>
                <div>
                  <Label className="text-[#0060AC]">Сотрудники*</Label>
                  <Input
                    value={meeting.staff}
                    onChange={(e) =>
                      handleSpppChange(index, "staff", e.target.value)
                    }
                    className="w-full"
                    placeholder="Введите текст"
                    style={{ color: "#000000" }}
                  />
                </div>
                <div>
                  <Label className="text-[#0060AC]">Представители*</Label>
                  <Input
                    value={meeting.representatives}
                    onChange={(e) =>
                      handleSpppChange(index, "representatives", e.target.value)
                    }
                    className="w-full"
                    placeholder="Введите текст"
                    style={{ color: "#000000" }}
                  />
                </div>
                <div>
                  <Label className="text-[#0060AC]">Причина*</Label>
                  <Input
                    value={meeting.reason}
                    onChange={(e) =>
                      handleSpppChange(index, "reason", e.target.value)
                    }
                    className="w-full"
                    placeholder="Введите текст"
                    style={{ color: "#000000" }}
                  />
                </div>
                <div>
                  <Label className="text-[#0060AC]">Решение*</Label>
                  <Input
                    value={meeting.decision}
                    onChange={(e) =>
                      handleSpppChange(index, "decision", e.target.value)
                    }
                    className="w-full"
                    placeholder="Введите текст"
                    style={{ color: "#000000" }}
                  />
                </div>
                <div>
                  <Label className="text-[#0060AC]">Примечание</Label>
                  <Input
                    value={meeting.note}
                    onChange={(e) =>
                      handleSpppChange(index, "note", e.target.value)
                    }
                    className="w-full"
                    placeholder="Введите текст"
                    style={{ color: "#000000" }}
                  />
                </div>
                {index > 0 && (
                  <div className="col-span-full flex justify-end">
                    <Button
                      onClick={() => removeSpppMeeting(index)}
                      variant="destructive"
                      className="text-white"
                    >
                      Удалить встречу
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button
              onClick={addSpppMeeting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Добавить встречу
            </Button>
          </div>
        );
      case 8:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-[#0060AC]">Начало статуса*</Label>
              <Input
                type="date"
                name="svoStart"
                value={studentData.svoStart}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Окончание статуса</Label>
              <Input
                type="date"
                name="svoEnd"
                value={studentData.svoEnd}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[#0060AC]">Документы</Label>
              <FileUpload
                value={studentData.svoDoc.map(
                  (file) => `${file.url}|${file.fileId}`
                )}
                onChange={handleFileChange("svoDoc")}
                folder="svo-files"
                entityId={student?._id || "new"}
                entityType="SvoStatus"
              />
            </div>
          </div>
        );
      case 9:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-[#0060AC]">Документы</Label>
              <div className="space-y-4">
                <FileUpload
                  value={studentData.scholarshipDoc.map(
                    (file) => `${file.url}|${file.fileId}`
                  )}
                  onChange={(files) => {
                    setStudentData((prev) => ({
                      ...prev,
                      scholarshipDoc: files.map((file) => {
                        const [url, fileId] = file.split("|");
                        return { url, fileId };
                      }),
                    }));
                  }}
                  folder="scholarship-files"
                  entityId={student?._id || "new"}
                  entityType="SocialScholarship"
                />
              </div>
            </div>
            <div>
              <Label className="text-[#0060AC]">Начало статуса*</Label>
              <Input
                type="date"
                name="scholarshipStart"
                value={studentData.scholarshipStart}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
            <div>
              <Label className="text-[#0060AC]">Окончание статуса</Label>
              <Input
                type="date"
                name="scholarshipEnd"
                value={studentData.scholarshipEnd}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Выберите дату"
                style={{ color: "#000000" }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
            <Button
              onClick={() => onClose()}
              variant="ghost"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="mb-6 px-6 py-3">
              <h2 className="text-2xl font-bold" style={{ color: "#0060AC" }}>
                {steps.find((s) => s.step === currentStep)?.title ||
                  "Ввод данных студента"}
              </h2>
            </div>
            <div className="flex flex-1 overflow-hidden px-6 py-2">
              <div className="w-1/6 flex-shrink-0 overflow-y-auto border-r">
                <Stepper value={currentStep} orientation="vertical">
                  {steps.map(({ step, title }) => (
                    <StepperItem
                      key={step}
                      step={step}
                      className="relative items-start not-last:flex-1"
                      onClick={() => setCurrentStep(step)}
                    >
                      <StepperTrigger
                        className={`items-start rounded pb-12 last:pb-0 ${
                          currentStep === step ? "" : ""
                        }`}
                      >
                        <StepperIndicator
                          className={
                            currentStep === step
                              ? "bg-[#0060AC]"
                              : "bg-gray-400"
                          }
                        />
                        <div className="mt-0.5 text-left cursor-pointer">
                          <StepperTitle
                            style={{
                              color:
                                currentStep === step ? "#0060AC" : "#737373",
                            }}
                          >
                            {title}
                          </StepperTitle>
                        </div>
                      </StepperTrigger>
                      {step < steps.length && (
                        <StepperSeparator className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]" />
                      )}
                    </StepperItem>
                  ))}
                </Stepper>
              </div>
              <div className="w-3/4 p-6 overflow-y-auto">
                {renderFormContent()}
              </div>
            </div>
            <div
              className="p-6 flex justify-between border-t bg-white"
              style={{
                position: "sticky",
                bottom: 0,
                zIndex: 10,
              }}
            >
              <Button
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                style={{ borderColor: "#0060AC" }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Назад
              </Button>
              {currentStep === 9 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {mode === "add" ? "Добавить студента" : "Сохранить изменения"}
                </Button>
              ) : (
                <Button
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Далее <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
