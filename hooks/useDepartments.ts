import { useState, useEffect } from "react";

type Department = { _id: string; name: string; code: string };

export default function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        if (res.ok) {
          setDepartments(
            data.map((d: any) => ({
              _id: d._id,
              name: d.name,
              code: d.code || d.name.slice(0, 3).toUpperCase(),
            }))
          );
          setError(null);
        } else {
          setError(data.error || "Не удалось загрузить отделения");
        }
      } catch (err) {
        setError(err.message || "Не удалось загрузить отделения");
      }
    };
    fetchDepartments();
  }, []);

  return { departments, error };
}
