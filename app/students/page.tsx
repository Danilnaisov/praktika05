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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/student";

export default function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    lastName: "",
    group: "",
    departmentId: "",
    admissionYear: "",
    asOfDate: "2025-02-08",
    hasOrphanStatus: "false",
    hasDisabilityStatus: "false",
    hasOVZStatus: "false",
    hasRiskGroupSOP: "false",
    hasSVOStatus: "false",
    hasSocialScholarship: "false",
    hasPenalties: "false",
    hasSPPP: "false",
    roomId: "",
  });

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        ...filters,
        hasOrphanStatus: filters.hasOrphanStatus,
        hasDisabilityStatus: filters.hasDisabilityStatus,
        hasOVZStatus: filters.hasOVZStatus,
        hasRiskGroupSOP: filters.hasRiskGroupSOP,
        hasSVOStatus: filters.hasSVOStatus,
        hasSocialScholarship: filters.hasSocialScholarship,
        hasPenalties: filters.hasPenalties,
        hasSPPP: filters.hasSPPP,
      }).toString();
      const res = await fetch(`/api/students/filter?${query}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
      } else if (data.students && Array.isArray(data.students)) {
        setStudents(data.students);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchStudents();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#9EA1A2]/20 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#0060AC] mb-6">
        База данных по воспитательной работе
      </h1>

      {/* Фильтры */}
      <Card className="mb-6 bg-white/80 border-[#0060AC]/30">
        <CardHeader>
          <CardTitle className="text-[#0060AC]">Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="lastName" className="text-[#0060AC]">
                Фамилия
              </Label>
              <Input
                id="lastName"
                placeholder="Введите фамилию"
                value={filters.lastName}
                onChange={(e) => handleFilterChange("lastName", e.target.value)}
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
            <div>
              <Label htmlFor="departmentId" className="text-[#0060AC]">
                Отделение
              </Label>
              <Input
                id="departmentId"
                placeholder="ID отделения"
                value={filters.departmentId}
                onChange={(e) =>
                  handleFilterChange("departmentId", e.target.value)
                }
                className="border-[#0060AC] focus:ring-[#0060AC]"
              />
            </div>
            <div>
              <Label htmlFor="admissionYear" className="text-[#0060AC]">
                Год поступления
              </Label>
              <Input
                id="admissionYear"
                placeholder="Год поступления"
                value={filters.admissionYear}
                onChange={(e) =>
                  handleFilterChange("admissionYear", e.target.value)
                }
                className="border-[#0060AC] focus:ring-[#0060AC]"
              />
            </div>
            <div>
              <Label htmlFor="asOfDate" className="text-[#0060AC]">
                На дату
              </Label>
              <Input
                id="asOfDate"
                type="date"
                value={filters.asOfDate}
                onChange={(e) => handleFilterChange("asOfDate", e.target.value)}
                className="border-[#0060AC] focus:ring-[#0060AC]"
              />
            </div>
            <div>
              <Label htmlFor="hasOrphanStatus" className="text-[#0060AC]">
                Сироты
              </Label>
              <Select
                value={filters.hasOrphanStatus}
                onValueChange={(value) =>
                  handleFilterChange("hasOrphanStatus", value)
                }
              >
                <SelectTrigger
                  id="hasOrphanStatus"
                  className="border-[#0060AC]"
                >
                  <SelectValue placeholder="Статус сироты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Все</SelectItem>
                  <SelectItem value="true">Действующие</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hasDisabilityStatus" className="text-[#0060AC]">
                Инвалиды
              </Label>
              <Select
                value={filters.hasDisabilityStatus}
                onValueChange={(value) =>
                  handleFilterChange("hasDisabilityStatus", value)
                }
              >
                <SelectTrigger
                  id="hasDisabilityStatus"
                  className="border-[#0060AC]"
                >
                  <SelectValue placeholder="Статус инвалида" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Все</SelectItem>
                  <SelectItem value="true">Действующие</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hasOVZStatus" className="text-[#0060AC]">
                ОВЗ
              </Label>
              <Select
                value={filters.hasOVZStatus}
                onValueChange={(value) =>
                  handleFilterChange("hasOVZStatus", value)
                }
              >
                <SelectTrigger id="hasOVZStatus" className="border-[#0060AC]">
                  <SelectValue placeholder="Статус ОВЗ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Все</SelectItem>
                  <SelectItem value="true">Действующие</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hasRiskGroupSOP" className="text-[#0060AC]">
                Группа риска
              </Label>
              <Select
                value={filters.hasRiskGroupSOP}
                onValueChange={(value) =>
                  handleFilterChange("hasRiskGroupSOP", value)
                }
              >
                <SelectTrigger
                  id="hasRiskGroupSOP"
                  className="border-[#0060AC]"
                >
                  <SelectValue placeholder="Группа риска" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Все</SelectItem>
                  <SelectItem value="true">Действующие</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hasSVOStatus" className="text-[#0060AC]">
                СВО
              </Label>
              <Select
                value={filters.hasSVOStatus}
                onValueChange={(value) =>
                  handleFilterChange("hasSVOStatus", value)
                }
              >
                <SelectTrigger id="hasSVOStatus" className="border-[#0060AC]">
                  <SelectValue placeholder="Статус СВО" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Все</SelectItem>
                  <SelectItem value="true">Действующие</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hasSocialScholarship" className="text-[#0060AC]">
                Соц. стипендия
              </Label>
              <Select
                value={filters.hasSocialScholarship}
                onValueChange={(value) =>
                  handleFilterChange("hasSocialScholarship", value)
                }
              >
                <SelectTrigger
                  id="hasSocialScholarship"
                  className="border-[#0060AC]"
                >
                  <SelectValue placeholder="Социальная стипендия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Все</SelectItem>
                  <SelectItem value="true">Действующие</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hasPenalties" className="text-[#0060AC]">
                Взыскания
              </Label>
              <Select
                value={filters.hasPenalties}
                onValueChange={(value) =>
                  handleFilterChange("hasPenalties", value)
                }
              >
                <SelectTrigger id="hasPenalties" className="border-[#0060AC]">
                  <SelectValue placeholder="Взыскания" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Все</SelectItem>
                  <SelectItem value="true">С взысканиями</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hasSPPP" className="text-[#0060AC]">
                СППП
              </Label>
              <Select
                value={filters.hasSPPP}
                onValueChange={(value) => handleFilterChange("hasSPPP", value)}
              >
                <SelectTrigger id="hasSPPP" className="border-[#0060AC]">
                  <SelectValue placeholder="СППП" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Все</SelectItem>
                  <SelectItem value="true">С СППП</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="roomId" className="text-[#0060AC]">
                Комната
              </Label>
              <Input
                id="roomId"
                placeholder="ID комнаты"
                value={filters.roomId}
                onChange={(e) => handleFilterChange("roomId", e.target.value)}
                className="border-[#0060AC] focus:ring-[#0060AC]"
              />
            </div>
          </div>
          <Button
            onClick={applyFilters}
            className="mt-4 w-full bg-[#E41613] hover:bg-[#C41411] text-white"
          >
            Применить фильтры
          </Button>
        </CardContent>
      </Card>

      {/* Таблица и карточки */}
      {loading && <p className="text-[#0060AC]">Загрузка...</p>}
      {error && <p className="text-[#E41613]">{error}</p>}
      {!loading && !error && students.length === 0 && (
        <p className="text-[#0060AC]">Студенты не найдены</p>
      )}
      {!loading && students.length > 0 && (
        <>
          {/* Таблица для десктопа */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="bg-white/80 border-[#0060AC]/30 rounded-lg">
              <TableHeader>
                <TableRow className="hover:bg-[#9EA1A2]/20">
                  <TableHead className="text-[#0060AC] h-16">ФИО</TableHead>
                  <TableHead className="text-[#0060AC] h-16">
                    Дата рождения
                  </TableHead>
                  <TableHead className="text-[#0060AC] h-16">Группа</TableHead>
                  <TableHead className="text-[#0060AC] h-16">
                    Контактный номер
                  </TableHead>
                  <TableHead className="text-[#0060AC] h-16">
                    Финансирование
                  </TableHead>
                  <TableHead className="text-[#0060AC] h-16">
                    Образование
                  </TableHead>
                  <TableHead className="text-[#0060AC] h-16">Сирота</TableHead>
                  <TableHead className="text-[#0060AC] h-16">Инвалид</TableHead>
                  <TableHead className="text-[#0060AC] h-16">ОВЗ</TableHead>
                  <TableHead className="text-[#0060AC] h-16">
                    Группа риска
                  </TableHead>
                  <TableHead className="text-[#0060AC] h-16">СВО</TableHead>
                  <TableHead className="text-[#0060AC] h-16">
                    Соц. стипендия
                  </TableHead>
                  <TableHead className="text-[#0060AC] h-16">
                    Отчисление
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student._id}
                    className="hover:bg-[#9EA1A2]/10 h-20"
                  >
                    <TableCell className="whitespace-normal">{`${student.lastName} ${student.firstName} ${student.middleName}`}</TableCell>
                    <TableCell className="whitespace-normal">
                      {new Date(student.birthDate).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.group}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.phone}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.funding}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.education || "-"}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.orphanStatus?.order || "-"}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.disabilityStatus?.order || "-"}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.ovzStatus?.order || "-"}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.riskGroupSOP?.type || "-"}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.svoStatus?.document || "-"}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.socialScholarship?.document || "-"}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {student.expulsionInfo || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Карточки для мобильных */}
          <div className="md:hidden space-y-4">
            {students.map((student) => (
              <Card
                key={student._id}
                className="bg-white/80 border-[#0060AC]/30"
              >
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-semibold text-[#0060AC]">ФИО:</div>
                    <div>{`${student.lastName} ${student.firstName} ${student.middleName}`}</div>
                    <div className="font-semibold text-[#0060AC]">
                      Дата рождения:
                    </div>
                    <div>
                      {new Date(student.birthDate).toLocaleDateString("ru-RU")}
                    </div>
                    <div className="font-semibold text-[#0060AC]">Группа:</div>
                    <div>{student.group}</div>
                    <div className="font-semibold text-[#0060AC]">
                      Контактный номер:
                    </div>
                    <div>{student.phone}</div>
                    <div className="font-semibold text-[#0060AC]">
                      Финансирование:
                    </div>
                    <div>{student.funding}</div>
                    <div className="font-semibold text-[#0060AC]">
                      Образование:
                    </div>
                    <div>{student.education || "-"}</div>
                    <div className="font-semibold text-[#0060AC]">Сирота:</div>
                    <div>{student.orphanStatus?.order || "-"}</div>
                    <div className="font-semibold text-[#0060AC]">Инвалид:</div>
                    <div>{student.disabilityStatus?.order || "-"}</div>
                    <div className="font-semibold text-[#0060AC]">ОВЗ:</div>
                    <div>{student.ovzStatus?.order || "-"}</div>
                    <div className="font-semibold text-[#0060AC]">
                      Группа риска:
                    </div>
                    <div>{student.riskGroupSOP?.type || "-"}</div>
                    <div className="font-semibold text-[#0060AC]">СВО:</div>
                    <div>{student.svoStatus?.document || "-"}</div>
                    <div className="font-semibold text-[#0060AC]">
                      Соц. стипендия:
                    </div>
                    <div>{student.socialScholarship?.document || "-"}</div>
                    <div className="font-semibold text-[#0060AC]">
                      Отчисление:
                    </div>
                    <div>{student.expulsionInfo || "-"}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
