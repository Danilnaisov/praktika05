"use client";
import { Button } from "@/components/ui/button";
import { BlobProvider } from "@react-pdf/renderer";
import DormitoryReportPDF from "./DormitoryReportPDF";
import { useEffect, useState } from "react";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  group?: string;
  phone?: string;
  dormitory?: {
    startDate?: string;
    endDate?: string;
    note?: string;
  };
}

interface Room {
  _id: string;
  name: string;
  capacity: number;
  students?: Student[];
}

export default function DormitoryPDFButton({ rooms }: { rooms: Room[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Генерируем уникальное имя файла
  let fileName =
    "dormitory-report-" +
    new Date().toLocaleDateString().replace(/\//g, ".") +
    ".pdf";
  if (rooms.length === 1) {
    const room = rooms[0];
    fileName = `dormitory-room-${room.name}_${new Date()
      .toLocaleDateString()
      .replace(/\//g, ".")}.pdf`;
  }

  return (
    <BlobProvider
      document={
        <DormitoryReportPDF
          rooms={rooms}
          date={new Date().toLocaleDateString()}
        />
      }
    >
      {({ url, loading }) => (
        <Button
          className="bg-[#E41613] hover:bg-[#9C0D0B] text-white font-semibold rounded-lg px-6 py-2 transition-colors"
          disabled={loading}
          onClick={() => {
            if (url) {
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;
              link.click();
            }
          }}
        >
          {loading ? "Генерация..." : "Скачать отчёт по общежитию (PDF)"}
        </Button>
      )}
    </BlobProvider>
  );
}
