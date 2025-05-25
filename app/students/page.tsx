"use client";

import { useState, useEffect } from "react";
import StudentsTable from "@/components/StudentsTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import StudentModal from "@/components/StudentModal";
import Container from "@/components/Container";
import Header from "@/components/Header";
import StudentsListPDFButton from "@/components/Report/StudentsListPDFButton";
import { format } from "date-fns";
import { IStudent } from "@/types";

export default function StudentsPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [filters, setFilters] = useState({
    lastName: "",
    firstName: "",
    group: "",
    room: "",
    admissionYear: "",
    graduationYear: "",
    sppp: false,
    penalties: false,
    adult: "",
    status: "",
    orphan: "",
    disabled: "",
    ovz: "",
    svo: "",
    scholarship: "",
    riskGroup: "",
    sop: "",
    date: today,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [userRole, setUserRole] = useState<string>("");

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      lastName: "",
      firstName: "",
      group: "",
      room: "",
      admissionYear: "",
      graduationYear: "",
      sppp: false,
      penalties: false,
      adult: "",
      status: "",
      orphan: "",
      disabled: "",
      ovz: "",
      svo: "",
      scholarship: "",
      riskGroup: "",
      sop: "",
      date: today,
    });
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      setUserRole(role || "");
    }
  }, []);

  // Функция для получения студентов с учетом фильтров
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value.toString());
        });

        const response = await fetch(
          `/api/students?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при загрузке студентов");
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Ошибка при получении студентов:", error);
      }
    };

    if (token) {
      fetchStudents();
    }
  }, [filters, token]);

  return (
    <>
      <Header />
      <Container>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#0060AC]">
            Список студентов
          </h1>
          <div className="flex gap-4">
            {userRole === "Admin" && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#E41613] hover:bg-[#9C0D0B] text-white font-semibold rounded-lg px-6 py-2 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" /> Добавить студента
              </Button>
            )}
            <StudentsListPDFButton students={students} filters={filters} />
          </div>
        </div>
        <div className="mb-6 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              type="text"
              name="lastName"
              placeholder="Фамилия"
              value={filters.lastName}
              onChange={handleFilterChange}
              className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                filters.lastName ? "bg-[#E41613]/10" : ""
              }`}
            />
            <Input
              type="text"
              name="firstName"
              placeholder="Имя"
              value={filters.firstName}
              onChange={handleFilterChange}
              className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                filters.firstName ? "bg-[#E41613]/10" : ""
              }`}
            />
            <Input
              type="text"
              name="group"
              placeholder="Группа"
              value={filters.group}
              onChange={handleFilterChange}
              className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                filters.group ? "bg-[#E41613]/10" : ""
              }`}
            />
            <Input
              type="text"
              name="room"
              placeholder="Комната"
              value={filters.room}
              onChange={handleFilterChange}
              className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                filters.room ? "bg-[#E41613]/10" : ""
              }`}
            />
            <Input
              type="number"
              name="admissionYear"
              placeholder="Год поступления"
              value={filters.admissionYear}
              onChange={handleFilterChange}
              className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                filters.admissionYear ? "bg-[#E41613]/10" : ""
              }`}
            />
            <Input
              type="number"
              name="graduationYear"
              placeholder="Год окончания"
              value={filters.graduationYear}
              onChange={handleFilterChange}
              className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                filters.graduationYear ? "bg-[#E41613]/10" : ""
              }`}
            />
            <Input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                filters.date !== today ? "bg-[#E41613]/10" : ""
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`flex items-center gap-2 ${
                filters.sppp ? "bg-[#E41613]/10 rounded px-2 py-1" : ""
              }`}
            >
              <Checkbox
                id="sppp"
                name="sppp"
                checked={filters.sppp}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, sppp: !!checked }))
                }
              />
              <label htmlFor="sppp" className="text-[#737373]">
                СППП
              </label>
            </div>
            <div
              className={`flex items-center gap-2 ${
                filters.penalties ? "bg-[#E41613]/10 rounded px-2 py-1" : ""
              }`}
            >
              <Checkbox
                id="penalties"
                name="penalties"
                checked={filters.penalties}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, penalties: !!checked }))
                }
              />
              <label htmlFor="penalties" className="text-[#737373]">
                Взыскания
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              name="adult"
              value={filters.adult}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, adult: value }))
              }
            >
              <SelectTrigger
                className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                  filters.adult ? "bg-[#E41613]/10" : ""
                }`}
              >
                <SelectValue placeholder="Совершеннолетние" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="true">Да</SelectItem>
                <SelectItem value="false">Нет</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="status"
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger
                className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                  filters.status ? "bg-[#E41613]/10" : ""
                }`}
              >
                <SelectValue placeholder="Учащиеся/Отчисленные" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="active">Учащиеся</SelectItem>
                <SelectItem value="expelled">Отчисленные</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="orphan"
              value={filters.orphan}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, orphan: value }))
              }
            >
              <SelectTrigger
                className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                  filters.orphan ? "bg-[#E41613]/10" : ""
                }`}
              >
                <SelectValue placeholder="Статус Сирота" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="true">Действующие</SelectItem>
                <SelectItem value="expired">Снятые</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="disabled"
              value={filters.disabled}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, disabled: value }))
              }
            >
              <SelectTrigger
                className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                  filters.disabled ? "bg-[#E41613]/10" : ""
                }`}
              >
                <SelectValue placeholder="Статус Инвалиды" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="true">Действующие</SelectItem>
                <SelectItem value="expired">Снятые</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="ovz"
              value={filters.ovz}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, ovz: value }))
              }
            >
              <SelectTrigger
                className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                  filters.ovz ? "bg-[#E41613]/10" : ""
                }`}
              >
                <SelectValue placeholder="Статус ОВЗ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="true">Действующие</SelectItem>
                <SelectItem value="expired">Снятые</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="svo"
              value={filters.svo}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, svo: value }))
              }
            >
              <SelectTrigger
                className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                  filters.svo ? "bg-[#E41613]/10" : ""
                }`}
              >
                <SelectValue placeholder="Статус СВО" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="true">Действующие</SelectItem>
                <SelectItem value="expired">Снятые</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="scholarship"
              value={filters.scholarship}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, scholarship: value }))
              }
            >
              <SelectTrigger
                className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                  filters.scholarship ? "bg-[#E41613]/10" : ""
                }`}
              >
                <SelectValue placeholder="Социальная стипендия" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="true">Действующие</SelectItem>
                <SelectItem value="expired">Снятые</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="riskGroup"
              value={filters.riskGroup}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, riskGroup: value }))
              }
            >
              <SelectTrigger
                className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                  filters.riskGroup ? "bg-[#E41613]/10" : ""
                }`}
              >
                <SelectValue placeholder="Группа риска" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="true">Действующие</SelectItem>
                <SelectItem value="expired">Снятые</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="sop"
              value={filters.sop}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, sop: value }))
              }
            >
              <SelectTrigger
                className={`border-[#0060AC] focus:border-[#0060AC] text-[#737373] ${
                  filters.sop ? "bg-[#E41613]/10" : ""
                }`}
              >
                <SelectValue placeholder="СОП" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="true">Действующие</SelectItem>
                <SelectItem value="expired">Снятые</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={resetFilters}
              className="bg-[#737373] hover:bg-[#363636] text-white hover:text-white font-semibold rounded-lg px-6 py-2 transition-colors border-none"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Сбросить фильтры
            </Button>
          </div>
          <StudentsTable filters={filters} token={token} />
        </div>

        <StudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
        />
      </Container>
    </>
  );
}
