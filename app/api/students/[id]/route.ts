import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Student from "@/models/Student";
import ErrorLog from "@/models/ErrorLog";
import OrphanStatus from "@/models/OrphanStatus";
import DisabilityStatus from "@/models/DisabilityStatus";
import OvzStatus from "@/models/OvzStatus";
import SvoStatus from "@/models/SvoStatus";
import SocialScholarship from "@/models/SocialScholarship";
import RiskGroupSop from "@/models/RiskGroupSop";
import Sppp from "@/models/Sppp";
import Dormitory from "@/models/Dormitory";
import Department from "@/models/Department";
import mongoose from "mongoose";
import {
  saveOrphanStatus,
  saveDisabilityStatus,
  saveOvzStatus,
  saveSvoStatus,
  saveSocialScholarship,
  saveRiskGroupSop,
  saveDormitory,
} from "@/app/services/studentStatusService";
import { saveSpppMeetings } from "@/app/services/spppService";

interface SpppMeeting {
  date: string;
  staff: string[];
  representatives: string[];
  reason: string;
  decision: string;
  note: string;
}

function getIdFromRequest(request: NextRequest): string {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  return parts[parts.length - 2] === "[id]"
    ? parts[parts.length - 1]
    : parts.pop() || "";
}

export async function GET(request: NextRequest) {
  const id = getIdFromRequest(request);
  try {
    await connectToDatabase();
    await Promise.all([
      import("@/models/Student"),
      import("@/models/Department"),
      import("@/models/File"),
      import("@/models/ErrorLog"),
      import("@/models/OrphanStatus"),
      import("@/models/DisabilityStatus"),
      import("@/models/OvzStatus"),
      import("@/models/SvoStatus"),
      import("@/models/SocialScholarship"),
      import("@/models/RiskGroupSop"),
      import("@/models/Sppp"),
      import("@/models/Dormitory"),
      import("@/models/Room"),
    ]);

    const student = await Student.findById(id)
      .populate({
        path: "departmentId",
        model: Department,
      })
      .populate("files");

    if (!student) {
      return NextResponse.json({ error: "Студент не найден" }, { status: 404 });
    }

    // Получаем все статусы и связанные данные
    const [
      orphanStatus,
      disabilityStatus,
      ovzStatus,
      svoStatus,
      socialScholarship,
      riskGroupSop,
      sppp,
      dormitory,
    ] = await Promise.all([
      OrphanStatus.findOne({ studentId: id }).populate("files"),
      DisabilityStatus.findOne({ studentId: id }).populate("files"),
      OvzStatus.findOne({ studentId: id }).populate("files"),
      SvoStatus.findOne({ studentId: id }).populate("files"),
      SocialScholarship.findOne({ studentId: id }).populate("files"),
      RiskGroupSop.findOne({ studentId: id }),
      Sppp.find({ studentId: id }),
      Dormitory.findOne({ studentId: id }).populate("files").populate({
        path: "roomId",
        model: "Room",
      }),
    ]);

    // Объединяем все данные
    const studentData = {
      ...student.toObject(),
      orphanStatus: orphanStatus ? orphanStatus.toObject() : null,
      disabilityStatus: disabilityStatus ? disabilityStatus.toObject() : null,
      ovzStatus: ovzStatus ? ovzStatus.toObject() : null,
      svoStatus: svoStatus ? svoStatus.toObject() : null,
      socialScholarship: socialScholarship
        ? socialScholarship.toObject()
        : null,
      riskGroupSop: riskGroupSop
        ? {
            ...riskGroupSop.toObject(),
            type: riskGroupSop.type === "sop" ? "СОП" : "Группа риска",
            reason: riskGroupSop.reason,
          }
        : null,
      sppp: sppp
        ? sppp.map((meeting) => ({
            ...meeting.toObject(),
            staff: meeting.attendeesEmployees,
            representatives: meeting.attendeesRepresentatives,
            reason: meeting.reason,
            decision: meeting.decision,
            note: meeting.note,
          }))
        : [],
      dormitory: dormitory ? dormitory.toObject() : null,
    };

    return NextResponse.json(studentData);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Неизвестная ошибка" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const id = getIdFromRequest(request);
  try {
    await connectToDatabase();
    const data = await request.json();
    const student = await Student.findById(id);
    if (!student) {
      throw new Error("Студент не найден");
    }
    Object.assign(student, {
      lastName: data.lastName,
      firstName: data.firstName,
      middleName: data.middleName,
      birthDate: data.birthDate,
      gender: data.gender,
      phone: data.phone,
      education: data.education,
      departmentId: new mongoose.Types.ObjectId(data.departmentId),
      group: data.group,
      funding: data.funding,
      admissionYear: data.admissionYear,
      graduationYear: data.graduationYear,
      expulsionInfo: data.expulsionInfo,
      expulsionDate: data.expulsionDate,
      note: data.note,
    });
    await student.save();
    await saveOrphanStatus(id, {
      order: data.orphanOrder,
      startDate: data.orphanStart,
      endDate: data.orphanEnd,
      note: data.orphanNote,
      files: data.orphanFiles,
    });
    await saveDisabilityStatus(id, {
      order: data.disabledOrder,
      startDate: data.disabledStart,
      endDate: data.disabledEnd,
      note: data.disabledNote,
      disabilityType: data.disabledType,
      files: data.disabledFiles,
    });
    await saveOvzStatus(id, {
      order: data.ovzOrder,
      startDate: data.ovzStart,
      endDate: data.ovzEnd,
      note: data.ovzNote,
      files: data.ovzFiles,
    });
    await saveSvoStatus(id, {
      startDate: data.svoStart,
      endDate: data.svoEnd,
      files: data.svoDoc,
    });
    await saveSocialScholarship(id, {
      startDate: data.scholarshipStart,
      endDate: data.scholarshipEnd,
      note: data.scholarshipNote,
      files: data.scholarshipDoc,
    });
    await saveDormitory(id, {
      roomId: data.dormitoryRoom,
      startDate: data.dormitoryStart,
      endDate: data.dormitoryEnd,
      note: data.dormitoryNote,
      files:
        data.dormitoryFiles?.map((file: { fileId: string } | string) => {
          if (typeof file === "object" && file.fileId) {
            return file.fileId;
          }
          if (typeof file === "string" && file.includes("|")) {
            return file.split("|")[1];
          }
          return file;
        }) || [],
    });
    if (data.riskSopType) {
      await saveRiskGroupSop(id, {
        type: data.riskSopType,
        startDate: data.riskSopStartDate,
        reason: data.riskSopStartReason,
        basis: data.riskSopStartBasis,
        endDate: data.riskSopEndDate,
        endReason: data.riskSopEndReason,
        endBasis: data.riskSopEndBasis,
        note: data.riskSopNote,
      });
    }
    try {
      await saveSpppMeetings(
        id,
        Array.isArray(data.spppDates)
          ? data.spppDates.map((meeting: SpppMeeting) => ({
              date: meeting.date,
              staff: meeting.staff,
              representatives: meeting.representatives,
              reason: meeting.reason,
              decision: meeting.decision,
              note: meeting.note,
            }))
          : []
      );
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Ошибка сохранения СППП" },
        { status: 400 }
      );
    }
    const updatedStudent = await Student.findById(id)
      .populate({
        path: "departmentId",
        model: Department,
      })
      .populate("files");
    const [
      orphanStatus,
      disabilityStatus,
      ovzStatus,
      svoStatus,
      socialScholarship,
      riskGroupSop,
      sppp,
      dormitory,
    ] = await Promise.all([
      OrphanStatus.findOne({ studentId: id }).populate("files"),
      DisabilityStatus.findOne({ studentId: id }).populate("files"),
      OvzStatus.findOne({ studentId: id }).populate("files"),
      SvoStatus.findOne({ studentId: id }).populate("files"),
      SocialScholarship.findOne({ studentId: id }).populate("files"),
      RiskGroupSop.findOne({ studentId: id }),
      Sppp.find({ studentId: id }),
      Dormitory.findOne({ studentId: id }).populate("files").populate({
        path: "roomId",
        model: "Room",
      }),
    ]);
    const studentData = {
      ...updatedStudent?.toObject(),
      orphanStatus: orphanStatus ? orphanStatus.toObject() : null,
      disabilityStatus: disabilityStatus ? disabilityStatus.toObject() : null,
      ovzStatus: ovzStatus ? ovzStatus.toObject() : null,
      svoStatus: svoStatus ? svoStatus.toObject() : null,
      socialScholarship: socialScholarship
        ? socialScholarship.toObject()
        : null,
      riskGroupSop: riskGroupSop
        ? {
            ...riskGroupSop.toObject(),
            type: riskGroupSop.type === "sop" ? "СОП" : "Группа риска",
            reason: riskGroupSop.reason,
          }
        : null,
      sppp: sppp
        ? sppp.map((meeting) => ({
            ...meeting.toObject(),
            staff: meeting.attendeesEmployees,
            representatives: meeting.attendeesRepresentatives,
            reason: meeting.reason,
            decision: meeting.decision,
            note: meeting.note,
          }))
        : [],
      dormitory: dormitory ? dormitory.toObject() : null,
    };
    return NextResponse.json(studentData);
  } catch (error: unknown) {
    await ErrorLog.create({
      errorCode: "UPDATE_STUDENT_ERROR",
      message: error instanceof Error ? error.message : "Неизвестная ошибка",
      timestamp: new Date(),
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Неизвестная ошибка" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromRequest(request);
  try {
    await connectToDatabase();
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return NextResponse.json({ error: "Студент не найден" }, { status: 404 });
    }
    return NextResponse.json({ message: "Студент удалён" });
  } catch (error: unknown) {
    await ErrorLog.create({
      errorCode: "DELETE_STUDENT_ERROR",
      message: error instanceof Error ? error.message : "Неизвестная ошибка",
      timestamp: new Date(),
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Неизвестная ошибка" },
      { status: 500 }
    );
  }
}
