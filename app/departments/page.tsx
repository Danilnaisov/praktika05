"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Department {
  _id: string;
  name: string;
  studentsCount?: number;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role") || "";
    setRole(userRole);
    if (!token) window.location.href = "/login";
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setDepartments(data);
    } catch {
      alert("Ошибка загрузки отделений");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return alert("Введите наименование отделения");
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error();
      setNewName("");
      fetchDepartments();
    } catch {
      alert("Ошибка добавления отделения");
    }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return alert("Введите наименование отделения");
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ _id: id, name: editName }),
      });
      if (!res.ok) throw new Error();
      setEditId(null);
      setEditName("");
      fetchDepartments();
    } catch {
      alert("Ошибка редактирования отделения");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить отделение?")) return;
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error();
      fetchDepartments();
    } catch {
      alert("Ошибка удаления отделения");
    }
  };

  return (
    <>
      <Header />
      <Container>
        <h1 className="text-3xl font-bold text-[#0060AC] mb-6">Отделения</h1>
        {role === "Admin" && (
          <div className="flex gap-2 mb-6">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Новое отделение"
              className="border-[#0060AC] focus:border-[#0060AC] text-[#737373]"
            />
            <Button
              onClick={handleAdd}
              className="bg-[#E41613] hover:bg-[#9C0D0B] text-white font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" /> Добавить
            </Button>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-[#B0CDE4] p-6">
          {loading ? (
            <div>Загрузка...</div>
          ) : departments.length === 0 ? (
            <div className="text-[#737373]">Нет отделений</div>
          ) : (
            <ul className="divide-y divide-[#B0CDE4]">
              {departments.map((dept) => (
                <li
                  key={dept._id}
                  className="flex items-center justify-between py-3"
                >
                  {editId === dept._id ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border-[#0060AC] focus:border-[#0060AC] text-[#737373] mr-2"
                      />
                      <Button
                        onClick={() => handleEdit(dept._id)}
                        className="bg-[#0060AC] hover:bg-[#004080] text-white font-semibold mr-2"
                      >
                        Сохранить
                      </Button>
                      <Button
                        onClick={() => {
                          setEditId(null);
                          setEditName("");
                        }}
                        variant="outline"
                        className="text-[#737373] border-[#B0CDE4]"
                      >
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg text-[#0060AC] font-bold">
                        {dept.name}
                        {typeof dept.studentsCount === "number" && (
                          <span className="ml-2 text-[#737373] font-normal">
                            ({dept.studentsCount})
                          </span>
                        )}
                      </span>
                      {role === "Admin" && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setEditId(dept._id);
                              setEditName(dept.name);
                            }}
                            variant="outline"
                            className="text-[#0060AC] border-[#B0CDE4]"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(dept._id)}
                            variant="outline"
                            className="text-[#E41613] border-[#B0CDE4]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </>
  );
}
