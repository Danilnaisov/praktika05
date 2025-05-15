"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    alert(res.ok ? "Студент добавлен" : result.error);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-[#9EA1A2] rounded-md"
    >
      <Input
        type="text"
        placeholder="Фамилия"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        className="mb-4 border-[#0060AC]"
      />
      <Input
        type="text"
        placeholder="Имя"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        className="mb-4 border-[#0060AC]"
      />
      <Input
        type="text"
        placeholder="Телефон (+7 (999)-123-45-67)"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="mb-4 border-[#0060AC]"
      />
      <Button
        type="submit"
        className="w-full bg-[#E41613] hover:bg-[#C41411] text-white"
      >
        Добавить
      </Button>
    </form>
  );
}
