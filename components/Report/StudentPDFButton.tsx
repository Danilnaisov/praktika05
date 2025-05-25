"use client";
import { Button } from "@/components/ui/button";
import StudentReportPDF from "./StudentReportPDF";
import { BlobProvider } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import {
  IStudent,
  IOrphanStatus,
  IDisabilityStatus,
  ISvoStatus,
  IOvzStatus,
  IRiskGroupSop,
  ISocialScholarship,
  ISppp,
  IDormitory,
} from "@/types";

export default function StudentPDFButton({
  student,
}: {
  student: IStudent & {
    orphanStatus?: IOrphanStatus;
    disabilityStatus?: IDisabilityStatus;
    svoStatus?: ISvoStatus;
    ovzStatus?: IOvzStatus;
    riskGroupSop?: IRiskGroupSop;
    socialScholarship?: ISocialScholarship;
    sppp?: ISppp[];
    dormitory?: IDormitory & { roomId?: { _id: string; name: string } };
    departmentId?: { name: string };
  };
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const fileName = `student-${student.lastName}_${student.firstName}_${
    student.middleName || ""
  }_${new Date().toLocaleDateString().replace(/\//g, ".")}.pdf`;

  return (
    <BlobProvider document={<StudentReportPDF student={student} />}>
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
          {loading ? "Генерация..." : "Скачать отчёт по студенту (PDF)"}
        </Button>
      )}
    </BlobProvider>
  );
}
