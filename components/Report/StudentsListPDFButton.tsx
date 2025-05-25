/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { IStudent } from "@/types";
import { BlobProvider } from "@react-pdf/renderer";
import { useState, useRef, useEffect } from "react";

import StudentsListReportPDF from "./StudentsListReportPDF";

export default function StudentsListPDFButton({
  students,
  filters,
}: {
  students: (IStudent & {
    orphanStatus?: any;
    disabilityStatus?: any;
    ovzStatus?: any;
    svoStatus?: any;
    riskGroupSop?: any;
    socialScholarship?: any;
  })[];
  filters: {
    lastName: string;
    firstName: string;
    group: string;
    room: string;
    admissionYear: string;
    graduationYear: string;
    sppp: boolean;
    penalties: boolean;
    adult: string;
    status: string;
    orphan: string;
    disabled: string;
    ovz: string;
    svo: string;
    scholarship: string;
    riskGroup: string;
    sop: string;
    date: string;
  };
}) {
  const [showPDF, setShowPDF] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hasDownloaded = useRef(false);
  const fileName = `students-list-report_${new Date()
    .toLocaleDateString()
    .replace(/\//g, ".")}.pdf`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        className="bg-[#E41613] hover:bg-[#9C0D0B] text-white font-semibold rounded-lg px-6 py-2 transition-colors"
        onClick={() => {
          hasDownloaded.current = false;
          setShowPDF(true);
        }}
      >
        Скачать отчёт по студентам (PDF)
      </Button>
      {showPDF && (
        <BlobProvider
          document={
            <StudentsListReportPDF
              students={students}
              filters={filters}
              date={filters.date}
            />
          }
        >
          {({ url }) => {
            if (url && !hasDownloaded.current) {
              hasDownloaded.current = true;
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;
              link.click();
              setShowPDF(false);
            }
            return null;
          }}
        </BlobProvider>
      )}
    </>
  );
}
