/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import StudentModal from "@/components/StudentModal";
import Container from "@/components/Container";
import Header from "@/components/Header";
import formatDate from "@/components/ui/formatDate";
import dynamic from "next/dynamic";

const StudentPDFButton = dynamic(
  () => import("@/components/Report/StudentPDFButton"),
  { ssr: false }
);

export default function StudentViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setUserRole(role || "");
      if (!token) {
        router.push("/login");
      }
    }
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students?id=${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Студент не найден");
        const data = await response.json();
        setStudent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  // Формируем файлы по статусам после получения данных студента
  useEffect(() => {
    if (!student) return;
    setStudent((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        orphanFiles:
          prev.orphanStatus?.files?.map((file: any) => ({
            url: file.path,
            fileId: file._id,
          })) || [],
        disabledFiles:
          prev.disabilityStatus?.files?.map((file: any) => ({
            url: file.path,
            fileId: file._id,
          })) || [],
        ovzFiles:
          prev.ovzStatus?.files?.map((file: any) => ({
            url: file.path,
            fileId: file._id,
          })) || [],
        dormitoryFiles:
          prev.dormitory?.files?.map((file: any) => ({
            url: file.path,
            fileId: file._id,
          })) || [],
        svoDoc:
          prev.svoStatus?.files?.map((file: any) => ({
            url: file.path,
            fileId: file._id,
          })) || [],
        scholarshipDoc:
          prev.socialScholarship?.files?.map((file: any) => ({
            url: file.path,
            fileId: file._id,
          })) || [],
      };
    });
  }, [
    student?.orphanStatus,
    student?.disabilityStatus,
    student?.ovzStatus,
    student?.dormitory,
    student?.svoStatus,
    student?.socialScholarship,
  ]);

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить студента?")) {
      try {
        const response = await fetch(`/api/students/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.ok) {
          alert("Студент удалён");
          router.push("/students");
        } else {
          const error = await response.json();
          alert(`Ошибка при удалении: ${error.error || response.statusText}`);
        }
      } catch (error) {
        console.error("Ошибка при удалении:", error);
        alert("Произошла ошибка при удалении студента");
      }
    }
  };

  if (loading) return <div className="text-center p-4">Загрузка...</div>;
  if (error || !student)
    return (
      <div className="text-center p-4 text-[#E41613]">
        Ошибка: {error || "Студент не найден"}
      </div>
    );

  return (
    <>
      <Header />
      <Container>
        <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl justify-center">
          {/* Карточка студента */}
          <div className="bg-white rounded-2xl border border-[#d3d7de] shadow p-8 flex-1 max-w-xl min-w-[350px]">
            <h2 className="text-2xl font-bold text-[#0060AC] mb-6">
              {student.lastName} {student.firstName} {student.middleName}
            </h2>
            <div className="space-y-1 text-base">
              <div>
                <span className="font-bold text-[#0060AC]">Дата рождения:</span>{" "}
                {formatDate(student.birthDate)}
              </div>
              <div>
                <span className="font-bold text-[#0060AC]">Группа:</span>{" "}
                {student.group}
              </div>
              <div>
                <span className="font-bold text-[#0060AC]">Отделение:</span>{" "}
                {student.departmentId?.name || ""}
              </div>
              <div>
                <span className="font-bold text-[#0060AC]">Телефон:</span>{" "}
                {student.phone}
              </div>
              <div>
                <span className="font-bold text-[#0060AC]">
                  Финансирование:
                </span>{" "}
                {student.funding}
              </div>
              <div>
                <span className="font-bold text-[#0060AC]">Образование:</span>{" "}
                {student.education}
              </div>
              <div>
                <span className="font-bold text-[#0060AC]">
                  Год поступления:
                </span>{" "}
                {student.admissionYear}
              </div>
              <div>
                <span className="font-bold text-[#0060AC]">Год выпуска:</span>{" "}
                {student.graduationYear}
              </div>
              <div>
                <span className="font-bold text-[#0060AC]">Пол:</span>{" "}
                {student.gender}
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <div className="flex gap-3">
                {userRole === "Admin" && (
                  <>
                    <Button
                      onClick={() => setIsEditModalOpen(true)}
                      className="bg-[#0060AC] hover:bg-[#004080] text-white font-semibold rounded-lg px-6 py-2"
                    >
                      Редактировать
                    </Button>
                    <Button
                      onClick={handleDelete}
                      className="bg-[#E41613] hover:bg-[#E41613] text-white font-semibold rounded-lg px-6 py-2"
                    >
                      Удалить
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => router.push("/students")}
                  className="bg-[#737373] hover:bg-[#363636] text-white font-semibold rounded-lg px-6 py-2"
                >
                  Назад
                </Button>
              </div>
              <StudentPDFButton student={student} />
            </div>
          </div>

          {/* Блок с файлами студента */}
          <div className="bg-white rounded-2xl border border-[#d3d7de] shadow p-6 w-full max-w-xs min-w-[320px] flex-shrink-0">
            <h2 className="text-2xl font-bold text-[#0060AC] mb-4 text-center">
              Список документов
            </h2>
            <div className="flex flex-col gap-3">
              {student.orphanFiles && student.orphanFiles.length > 0 && (
                <div>
                  <div className="font-semibold text-[#0060AC] mb-1">
                    Данные о сиротах
                  </div>
                  <div className="border border-[#0060AC] rounded-lg p-2 bg-[#f8fbff]">
                    {student.orphanFiles.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 mb-1 last:mb-0"
                      >
                        <span className="text-[#0060AC]">
                          <FileText size={18} />
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0060AC] hover:underline break-all"
                        >
                          {file.url.split("/").pop()}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {student.disabledFiles && student.disabledFiles.length > 0 && (
                <div>
                  <div className="font-semibold text-[#0060AC] mb-1">
                    Данные о инвалидах
                  </div>
                  <div className="border border-[#0060AC] rounded-lg p-2 bg-[#f8fbff]">
                    {student.disabledFiles.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 mb-1 last:mb-0"
                      >
                        <span className="text-[#0060AC]">
                          <FileText size={18} />
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0060AC] hover:underline break-all"
                        >
                          {file.url.split("/").pop()}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {student.ovzFiles && student.ovzFiles.length > 0 && (
                <div>
                  <div className="font-semibold text-[#0060AC] mb-1">
                    Данные об ОВЗ
                  </div>
                  <div className="border border-[#0060AC] rounded-lg p-2 bg-[#f8fbff]">
                    {student.ovzFiles.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 mb-1 last:mb-0"
                      >
                        <span className="text-[#0060AC]">
                          <FileText size={18} />
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0060AC] hover:underline break-all"
                        >
                          {file.url.split("/").pop()}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {student.dormitoryFiles && student.dormitoryFiles.length > 0 && (
                <div>
                  <div className="font-semibold text-[#0060AC] mb-1">
                    Данные об общежитии
                  </div>
                  <div className="border border-[#0060AC] rounded-lg p-2 bg-[#f8fbff]">
                    {student.dormitoryFiles.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 mb-1 last:mb-0"
                      >
                        <span className="text-[#0060AC]">
                          <FileText size={18} />
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0060AC] hover:underline break-all"
                        >
                          {file.url.split("/").pop()}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {student.svoDoc && student.svoDoc.length > 0 && (
                <div>
                  <div className="font-semibold text-[#0060AC] mb-1">
                    Данные о статусе СВО
                  </div>
                  <div className="border border-[#0060AC] rounded-lg p-2 bg-[#f8fbff]">
                    {student.svoDoc.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 mb-1 last:mb-0"
                      >
                        <span className="text-[#0060AC]">
                          <FileText size={18} />
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0060AC] hover:underline break-all"
                        >
                          {file.url.split("/").pop()}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {student.scholarshipDoc && student.scholarshipDoc.length > 0 && (
                <div>
                  <div className="font-semibold text-[#0060AC] mb-1">
                    Социальная выплата
                  </div>
                  <div className="border border-[#0060AC] rounded-lg p-2 bg-[#f8fbff]">
                    {student.scholarshipDoc.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 mb-1 last:mb-0"
                      >
                        <span className="text-[#0060AC]">
                          <FileText size={18} />
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0060AC] hover:underline break-all"
                        >
                          {file.url.split("/").pop()}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <StudentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          student={student}
          mode="edit"
        />
      </Container>
    </>
  );
}
