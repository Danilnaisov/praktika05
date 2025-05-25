/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Room from "@/models/Room";
import { authMiddleware } from "@/utils/auth";
import mongoose from "mongoose";
import { saveRiskGroupSop } from "@/app/services/studentStatusService";

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("id");

    // Получаем дату фильтрации (на дату)
    let filterDate: Date;
    if (searchParams.get("date")) {
      filterDate = new Date(searchParams.get("date")!);
      filterDate.setHours(0, 0, 0, 0);
    } else {
      filterDate = new Date();
      filterDate.setHours(0, 0, 0, 0);
    }

    // Если передан id, возвращаем одного студента со всеми статусами
    if (studentId) {
      const student = await Student.findById(studentId)
        .populate("departmentId")
        .populate("files")
        .lean();

      if (!student) {
        return NextResponse.json(
          { error: "Студент не найден" },
          { status: 404 }
        );
      }

      // Загружаем все статусы
      const [
        orphanStatus,
        disabilityStatus,
        ovzStatus,
        dormitory,
        svoStatus,
        socialScholarship,
        riskGroupSop,
        sppp,
      ] = await Promise.all([
        OrphanStatus.findOne({ studentId }).populate("files"),
        DisabilityStatus.findOne({ studentId }).populate("files"),
        OvzStatus.findOne({ studentId }).populate("files"),
        Dormitory.findOne({ studentId })
          .populate({
            path: "roomId",
            model: "Room",
          })
          .populate("files"),
        SvoStatus.findOne({ studentId }).populate("files"),
        SocialScholarship.findOne({ studentId }).populate("files"),
        RiskGroupSop.findOne({ studentId }),
        Sppp.find({ studentId }),
      ]);

      return NextResponse.json({
        ...student,
        orphanStatus,
        disabilityStatus,
        ovzStatus,
        dormitory,
        svoStatus,
        socialScholarship,
        riskGroupSop,
        sppp,
      });
    }

    // Если id не передан, возвращаем список студентов
    const filters: any = {};
    const pipeline: any[] = [{ $match: {} }];

    // Основные фильтры
    if (searchParams.get("lastName")) {
      filters.lastName = {
        $regex: searchParams.get("lastName"),
        $options: "i",
      };
    }
    if (searchParams.get("firstName")) {
      filters.firstName = {
        $regex: searchParams.get("firstName"),
        $options: "i",
      };
    }
    if (searchParams.get("group")) {
      filters.group = { $regex: searchParams.get("group"), $options: "i" };
    }
    if (searchParams.get("admissionYear")) {
      filters.admissionYear = Number(searchParams.get("admissionYear"));
    }
    if (searchParams.get("graduationYear")) {
      filters.graduationYear = Number(searchParams.get("graduationYear"));
    }
    if (searchParams.get("sppp") === "true") {
      const spppStudents = await Sppp.find().distinct("studentId");
      filters._id = filters._id
        ? { $in: [...new Set([...(filters._id.$in || []), ...spppStudents])] }
        : { $in: spppStudents };
    }
    if (searchParams.get("penalties") === "true") {
      filters.penalties = { $exists: true, $ne: "" };
    }
    if (searchParams.get("adult") === "true") {
      filters.birthDate = {
        $lte: new Date(
          filterDate.getFullYear() - 18,
          filterDate.getMonth(),
          filterDate.getDate()
        ),
      };
    } else if (searchParams.get("adult") === "false") {
      filters.birthDate = {
        $gt: new Date(
          filterDate.getFullYear() - 18,
          filterDate.getMonth(),
          filterDate.getDate()
        ),
      };
    }
    if (searchParams.get("status") === "active") {
      // Студент считается учащимся, если filterDate между 1 сентября года поступления и 31 августа года окончания
      filters.$expr = {
        $and: [
          {
            $lte: [
              {
                $dateFromString: {
                  dateString: {
                    $concat: [{ $toString: "$admissionYear" }, "-09-01"],
                  },
                },
              },
              filterDate,
            ],
          },
          {
            $gte: [
              {
                $dateFromString: {
                  dateString: {
                    $concat: [{ $toString: "$graduationYear" }, "-08-31"],
                  },
                },
              },
              filterDate,
            ],
          },
        ],
      };
    } else if (searchParams.get("status") === "expelled") {
      filters.expulsionInfo = { $exists: true, $ne: "" };
    }
    if (searchParams.get("room")) {
      const rooms = await Room.find({ name: searchParams.get("room") }).select(
        "_id"
      );
      const roomIds = rooms.map((room) => room._id);

      if (roomIds.length === 0) {
        filters._id = { $in: [] };
      } else {
        const dormitories = await Dormitory.find({
          roomId: { $in: roomIds },
          $or: [
            { startDate: { $lte: filterDate }, endDate: { $gte: filterDate } },
            { startDate: { $lte: filterDate }, endDate: null },
          ],
        }).distinct("studentId");
        filters._id = filters._id
          ? { $in: [...new Set([...(filters._id.$in || []), ...dormitories])] }
          : { $in: dormitories };
      }
    }

    // Фильтры по статусам
    const statusFilters = [
      { param: "orphan", model: OrphanStatus, field: "orphanStatus" },
      { param: "disabled", model: DisabilityStatus, field: "disabilityStatus" },
      { param: "ovz", model: OvzStatus, field: "ovzStatus" },
      { param: "svo", model: SvoStatus, field: "svoStatus" },
      {
        param: "scholarship",
        model: SocialScholarship,
        field: "socialScholarship",
      },
      {
        param: "riskGroup",
        model: RiskGroupSop,
        field: "riskGroupSop",
        type: "risk",
      },
      { param: "sop", model: RiskGroupSop, field: "riskGroupSop", type: "sop" },
    ];

    // Собираем studentId для каждого статуса
    const statusStudentIds: { [key: string]: Set<string> } = {};

    for (const { param, model, field, type } of statusFilters) {
      const value = searchParams.get(param);
      if (!value) continue;

      const baseQuery: any = {};
      if (type) baseQuery.type = type;

      if (value === "true") {
        const activeQuery = {
          ...baseQuery,
          startDate: { $lte: filterDate },
          $or: [
            { endDate: { $gte: filterDate } },
            { endDate: { $exists: false } },
          ],
        };
        const activeStudents = await model
          .find(activeQuery)
          .distinct("studentId");
        statusStudentIds[param] = new Set(activeStudents.map(String));
      } else if (value === "all") {
        const allStudents = await model.find(baseQuery).distinct("studentId");
        statusStudentIds[param] = new Set(allStudents.map(String));
      } else if (value === "expired") {
        const expiredQuery = {
          ...baseQuery,
          endDate: { $lt: filterDate },
          startDate: { $lte: filterDate },
        };
        const expiredStudents = await model
          .find(expiredQuery)
          .distinct("studentId");

        const activeQuery = {
          ...baseQuery,
          startDate: { $lte: filterDate },
          $or: [
            { endDate: { $gte: filterDate } },
            { endDate: { $exists: false } },
          ],
        };
        const activeStudents = await model
          .find(activeQuery)
          .distinct("studentId");
        const activeSet = new Set(activeStudents.map(String));
        const expiredSet = new Set(
          [...new Set(expiredStudents.map(String))].filter(
            (id) => !activeSet.has(id)
          )
        );
        statusStudentIds[param] = expiredSet;
      }
    }

    // Комбинируем фильтры по статусам (пересечение)
    const statusKeys = Object.keys(statusStudentIds);
    if (statusKeys.length > 0) {
      let combinedIds: Set<string> = statusStudentIds[statusKeys[0]];
      for (let i = 1; i < statusKeys.length; i++) {
        const currentIds = statusStudentIds[statusKeys[i]];
        combinedIds = new Set(
          [...combinedIds].filter((id) => currentIds.has(id))
        );
      }
      // Преобразуем строки в ObjectId
      const objectIds = [...combinedIds].map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      filters._id = filters._id
        ? { $in: [...new Set([...(filters._id.$in || []), ...objectIds])] }
        : { $in: objectIds };
    }

    if (Object.keys(filters).length > 0) {
      pipeline[0].$match = filters;
    }

    const students = await Student.aggregate(pipeline).exec();
    const populatedStudents = await Student.populate(students, [
      { path: "departmentId" },
      { path: "files" },
    ]);

    // Загружаем все статусы для каждого студента
    const studentsWithStatuses = await Promise.all(
      populatedStudents.map(async (student) => {
        const [
          orphanStatus,
          disabilityStatus,
          ovzStatus,
          dormitory,
          svoStatus,
          socialScholarship,
          riskGroupSop,
          sppp,
        ] = await Promise.all([
          OrphanStatus.findOne({ studentId: student._id }).populate("files"),
          DisabilityStatus.findOne({ studentId: student._id }).populate(
            "files"
          ),
          OvzStatus.findOne({ studentId: student._id }).populate("files"),
          Dormitory.findOne({ studentId: student._id }).populate("files"),
          SvoStatus.findOne({ studentId: student._id }).populate("files"),
          SocialScholarship.findOne({ studentId: student._id }).populate(
            "files"
          ),
          RiskGroupSop.findOne({ studentId: student._id }),
          Sppp.find({ studentId: student._id }),
        ]);

        return {
          ...student,
          orphanStatus,
          disabilityStatus,
          ovzStatus,
          dormitory,
          svoStatus,
          socialScholarship,
          riskGroupSop,
          sppp,
        };
      })
    );

    return NextResponse.json(studentsWithStatuses);
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "GET_STUDENTS_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { user } = await authMiddleware(req);

    const data = await req.json();

    // Создаем студента
    const student = new Student({
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
      parentInfo: data.parentInfo,
      penalties: data.penalties,
    });
    await student.save();

    // Создаем статусы и привязываем файлы
    if (
      data.orphanOrder ||
      data.orphanStart ||
      data.orphanEnd ||
      data.orphanNote ||
      data.orphanFiles?.length > 0
    ) {
      const orphanStatus = new OrphanStatus({
        studentId: student._id,
        order: data.orphanOrder,
        startDate: data.orphanStart,
        endDate: data.orphanEnd,
        note: data.orphanNote,
        files:
          data.orphanFiles?.map((file: any) => {
            if (typeof file === "object" && file.fileId) {
              return file.fileId;
            }
            if (typeof file === "string" && file.includes("|")) {
              return file.split("|")[1];
            }
            return file;
          }) || [],
      });
      await orphanStatus.save();

      // Добавляем файлы к студенту
      if (data.orphanFiles?.length > 0) {
        student.files = [
          ...(student.files || []),
          ...data.orphanFiles.map(
            (file: { fileId: string }) =>
              new mongoose.Types.ObjectId(file.fileId)
          ),
        ];
      }
    }

    if (
      data.disabledOrder ||
      data.disabledStart ||
      data.disabledEnd ||
      data.disabledNote ||
      data.disabledType ||
      data.disabledFiles?.length > 0
    ) {
      if (!data.disabledType) {
        throw new Error(
          "Тип инвалидности обязателен для создания статуса инвалидности"
        );
      }
      const disabilityStatus = new DisabilityStatus({
        studentId: student._id,
        order: data.disabledOrder,
        startDate: data.disabledStart,
        endDate: data.disabledEnd,
        note: data.disabledNote,
        disabilityType: data.disabledType,
        files:
          data.disabledFiles?.map((file: any) => {
            if (typeof file === "object" && file.fileId) {
              return file.fileId;
            }
            if (typeof file === "string" && file.includes("|")) {
              return file.split("|")[1];
            }
            return file;
          }) || [],
      });
      await disabilityStatus.save();

      // Добавляем файлы к студенту
      if (data.disabledFiles?.length > 0) {
        student.files = [
          ...(student.files || []),
          ...data.disabledFiles.map(
            (file: { fileId: string }) =>
              new mongoose.Types.ObjectId(file.fileId)
          ),
        ];
      }
    }

    if (
      data.ovzOrder ||
      data.ovzStart ||
      data.ovzEnd ||
      data.ovzNote ||
      data.ovzFiles?.length > 0
    ) {
      const ovzStatus = new OvzStatus({
        studentId: student._id,
        order: data.ovzOrder,
        startDate: data.ovzStart,
        endDate: data.ovzEnd,
        note: data.ovzNote,
        files:
          data.ovzFiles?.map((file: any) => {
            if (typeof file === "object" && file.fileId) {
              return file.fileId;
            }
            if (typeof file === "string" && file.includes("|")) {
              return file.split("|")[1];
            }
            return file;
          }) || [],
      });
      await ovzStatus.save();

      // Добавляем файлы к студенту
      if (data.ovzFiles?.length > 0) {
        student.files = [
          ...(student.files || []),
          ...data.ovzFiles.map(
            (file: { fileId: string }) =>
              new mongoose.Types.ObjectId(file.fileId)
          ),
        ];
      }
    }

    if (
      data.dormitoryRoom ||
      data.dormitoryStart ||
      data.dormitoryEnd ||
      data.dormitoryNote ||
      data.dormitoryFiles?.length > 0
    ) {
      const dormitory = new Dormitory({
        studentId: student._id,
        roomId: data.dormitoryRoom,
        startDate: data.dormitoryStart,
        endDate: data.dormitoryEnd,
        note: data.dormitoryNote,
        files:
          data.dormitoryFiles?.map((file: any) => {
            if (typeof file === "object" && file.fileId) {
              return file.fileId;
            }
            if (typeof file === "string" && file.includes("|")) {
              return file.split("|")[1];
            }
            return file;
          }) || [],
      });
      await dormitory.save();

      // Добавляем файлы к студенту
      if (data.dormitoryFiles?.length > 0) {
        student.files = [
          ...(student.files || []),
          ...data.dormitoryFiles.map(
            (file: { fileId: string }) =>
              new mongoose.Types.ObjectId(file.fileId)
          ),
        ];
      }
    }

    if (data.svoStart || data.svoEnd || data.svoDoc?.length > 0) {
      const svoStatus = new SvoStatus({
        studentId: student._id,
        startDate: data.svoStart,
        endDate: data.svoEnd,
        files:
          data.svoDoc?.map((file: any) => {
            if (typeof file === "object" && file.fileId) {
              return file.fileId;
            }
            if (typeof file === "string" && file.includes("|")) {
              return file.split("|")[1];
            }
            return file;
          }) || [],
      });
      await svoStatus.save();

      // Добавляем файлы к студенту
      if (data.svoDoc?.length > 0) {
        student.files = [
          ...(student.files || []),
          ...data.svoDoc.map(
            (file: { fileId: string }) =>
              new mongoose.Types.ObjectId(file.fileId)
          ),
        ];
      }
    }

    if (
      data.scholarshipStart ||
      data.scholarshipEnd ||
      data.scholarshipDoc?.length > 0
    ) {
      const socialScholarship = new SocialScholarship({
        studentId: student._id,
        startDate: data.scholarshipStart,
        endDate: data.scholarshipEnd,
        note: data.scholarshipNote,
        files:
          data.scholarshipDoc?.map((file: any) => {
            if (typeof file === "object" && file.fileId) {
              return file.fileId;
            }
            if (typeof file === "string" && file.includes("|")) {
              return file.split("|")[1];
            }
            return file;
          }) || [],
      });
      await socialScholarship.save();

      // Добавляем файлы к студенту
      if (data.scholarshipDoc?.length > 0) {
        student.files = [
          ...(student.files || []),
          ...data.scholarshipDoc.map(
            (file: { fileId: string }) =>
              new mongoose.Types.ObjectId(file.fileId)
          ),
        ];
      }
    }

    // Сохраняем статус Группа риска/СОП
    if (data.riskSopType) {
      await saveRiskGroupSop(student._id, {
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

    // Обработка СППП
    if (data.spppDates?.length > 0) {
      const spppPromises = data.spppDates
        .filter(
          (meeting: any) =>
            meeting.date &&
            meeting.staff &&
            meeting.representatives &&
            meeting.reason &&
            meeting.decision
        )
        .map((meeting: any) =>
          new Sppp({
            studentId: student._id,
            date: meeting.date,
            attendeesEmployees: meeting.staff,
            attendeesRepresentatives: meeting.representatives,
            reason: meeting.reason,
            basis: meeting.reason,
            decision: meeting.decision,
            note: meeting.note,
          }).save()
        );

      await Promise.all(spppPromises);
    }

    // Сохраняем обновленного студента с файлами
    await student.save();

    // Загружаем все связанные данные для ответа
    const populatedStudent = await Student.findById(student._id)
      .populate("departmentId")
      .populate("files")
      .lean();

    // Загружаем все статусы
    const [
      orphanStatus,
      disabilityStatus,
      ovzStatus,
      dormitory,
      svoStatus,
      socialScholarship,
      riskGroupSop,
      sppp,
    ] = await Promise.all([
      OrphanStatus.findOne({ studentId: student._id }).populate("files"),
      DisabilityStatus.findOne({ studentId: student._id }).populate("files"),
      OvzStatus.findOne({ studentId: student._id }).populate("files"),
      Dormitory.findOne({ studentId: student._id }).populate("files"),
      SvoStatus.findOne({ studentId: student._id }).populate("files"),
      SocialScholarship.findOne({ studentId: student._id }).populate("files"),
      RiskGroupSop.findOne({ studentId: student._id }),
      Sppp.find({ studentId: student._id }),
    ]);

    return NextResponse.json(
      {
        ...populatedStudent,
        orphanStatus,
        disabilityStatus,
        ovzStatus,
        dormitory,
        svoStatus,
        socialScholarship,
        riskGroupSop,
        sppp,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Ошибка в /api/students POST:", error);
    await ErrorLog.create({
      errorCode: "CREATE_STUDENT_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json(
      { error: "Ошибка при создании студента" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { user } = await authMiddleware(req);

    const data = await req.json();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Обновляем студента
      const student = await Student.findById(data._id);
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
        parentInfo: data.parentInfo,
        penalties: data.penalties,
      });
      await student.save({ session });

      // Обновляем статусы и привязываем файлы
      if (
        data.orphanOrder ||
        data.orphanStart ||
        data.orphanEnd ||
        data.orphanNote ||
        data.orphanFiles?.length > 0
      ) {
        const orphanStatus = await OrphanStatus.findOne({
          studentId: student._id,
        });
        if (orphanStatus) {
          Object.assign(orphanStatus, {
            order: data.orphanOrder,
            startDate: data.orphanStart,
            endDate: data.orphanEnd,
            note: data.orphanNote,
            files:
              data.orphanFiles?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await orphanStatus.save({ session });
        } else {
          const newOrphanStatus = new OrphanStatus({
            studentId: student._id,
            order: data.orphanOrder,
            startDate: data.orphanStart,
            endDate: data.orphanEnd,
            note: data.orphanNote,
            files:
              data.orphanFiles?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await newOrphanStatus.save({ session });
        }
      }

      if (
        data.disabledOrder ||
        data.disabledStart ||
        data.disabledEnd ||
        data.disabledNote ||
        data.disabledType ||
        data.disabledFiles?.length > 0
      ) {
        const disabilityStatus = await DisabilityStatus.findOne({
          studentId: student._id,
        });
        if (disabilityStatus) {
          Object.assign(disabilityStatus, {
            order: data.disabledOrder,
            startDate: data.disabledStart,
            endDate: data.disabledEnd,
            note: data.disabledNote,
            disabilityType: data.disabledType,
            files:
              data.disabledFiles?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await disabilityStatus.save({ session });
        } else {
          const newDisabilityStatus = new DisabilityStatus({
            studentId: student._id,
            order: data.disabledOrder,
            startDate: data.disabledStart,
            endDate: data.disabledEnd,
            note: data.disabledNote,
            disabilityType: data.disabledType,
            files:
              data.disabledFiles?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await newDisabilityStatus.save({ session });
        }
      }

      if (
        data.ovzOrder ||
        data.ovzStart ||
        data.ovzEnd ||
        data.ovzNote ||
        data.ovzFiles?.length > 0
      ) {
        const ovzStatus = await OvzStatus.findOne({ studentId: student._id });
        if (ovzStatus) {
          Object.assign(ovzStatus, {
            order: data.ovzOrder,
            startDate: data.ovzStart,
            endDate: data.ovzEnd,
            note: data.ovzNote,
            files:
              data.ovzFiles?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await ovzStatus.save({ session });
        } else {
          const newOvzStatus = new OvzStatus({
            studentId: student._id,
            order: data.ovzOrder,
            startDate: data.ovzStart,
            endDate: data.ovzEnd,
            note: data.ovzNote,
            files:
              data.ovzFiles?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await newOvzStatus.save({ session });
        }
      }

      if (
        data.dormitoryRoom ||
        data.dormitoryStart ||
        data.dormitoryEnd ||
        data.dormitoryNote ||
        data.dormitoryFiles?.length > 0
      ) {
        const dormitory = await Dormitory.findOne({ studentId: student._id });
        if (dormitory) {
          Object.assign(dormitory, {
            roomId: data.dormitoryRoom,
            startDate: data.dormitoryStart,
            endDate: data.dormitoryEnd,
            note: data.dormitoryNote,
            files:
              data.dormitoryFiles?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await dormitory.save({ session });
        } else {
          const newDormitory = new Dormitory({
            studentId: student._id,
            roomId: data.dormitoryRoom,
            startDate: data.dormitoryStart,
            endDate: data.dormitoryEnd,
            note: data.dormitoryNote,
            files:
              data.dormitoryFiles?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await newDormitory.save({ session });
        }
      }

      if (data.svoStart || data.svoEnd || data.svoDoc?.length > 0) {
        const svoStatus = await SvoStatus.findOne({ studentId: student._id });
        if (svoStatus) {
          Object.assign(svoStatus, {
            startDate: data.svoStart,
            endDate: data.svoEnd,
            files:
              data.svoDoc?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await svoStatus.save({ session });
        } else {
          const newSvoStatus = new SvoStatus({
            studentId: student._id,
            startDate: data.svoStart,
            endDate: data.svoEnd,
            files:
              data.svoDoc?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await newSvoStatus.save({ session });
        }
      }

      if (
        data.scholarshipStart ||
        data.scholarshipEnd ||
        data.scholarshipDoc?.length > 0
      ) {
        const socialScholarship = await SocialScholarship.findOne({
          studentId: student._id,
        });
        if (socialScholarship) {
          Object.assign(socialScholarship, {
            startDate: data.scholarshipStart,
            endDate: data.scholarshipEnd,
            files:
              data.scholarshipDoc?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await socialScholarship.save({ session });
        } else {
          const newSocialScholarship = new SocialScholarship({
            studentId: student._id,
            startDate: data.scholarshipStart,
            endDate: data.scholarshipEnd,
            files:
              data.scholarshipDoc?.map((file: any) => {
                if (typeof file === "object" && file.fileId) {
                  return file.fileId;
                }
                if (typeof file === "string" && file.includes("|")) {
                  return file.split("|")[1];
                }
                return file;
              }) || [],
          });
          await newSocialScholarship.save({ session });
        }
      }

      if (
        data.riskSopType ||
        data.riskSopStartReason ||
        data.riskSopStartDate ||
        data.riskSopEndReason ||
        data.riskSopEndDate ||
        data.riskSopNote
      ) {
        const riskGroupSop = await RiskGroupSop.findOne({
          studentId: student._id,
        });
        if (riskGroupSop) {
          Object.assign(riskGroupSop, {
            type: data.riskSopType,
            startDate: data.riskSopStartDate,
            reason: data.riskSopStartReason,
            basis: data.riskSopStartBasis,
            endDate: data.riskSopEndDate,
            endReason: data.riskSopEndReason,
            endBasis: data.riskSopEndBasis,
            note: data.riskSopNote,
          });
          await riskGroupSop.save({ session });
        } else {
          const newRiskGroupSop = new RiskGroupSop({
            studentId: student._id,
            type: data.riskSopType,
            startDate: data.riskSopStartDate,
            reason: data.riskSopStartReason,
            basis: data.riskSopStartBasis,
            endDate: data.riskSopEndDate,
            endReason: data.riskSopEndReason,
            endBasis: data.riskSopEndBasis,
            note: data.riskSopNote,
          });
          await newRiskGroupSop.save({ session });
        }
      }

      // Обработка СППП
      if (data.spppDates?.length > 0) {
        // Удаляем старые записи СППП
        await Sppp.deleteMany({ studentId: student._id }, { session });

        // Создаем новые записи СППП
        const spppPromises = data.spppDates
          .filter(
            (meeting: any) =>
              meeting.date &&
              meeting.staff &&
              meeting.representatives &&
              meeting.reason &&
              meeting.decision
          )
          .map((meeting: any) =>
            new Sppp({
              studentId: student._id,
              date: meeting.date,
              attendeesEmployees: meeting.staff,
              attendeesRepresentatives: meeting.representatives,
              reason: meeting.reason,
              basis: meeting.reason,
              decision: meeting.decision,
              note: meeting.note,
            }).save({ session })
          );

        await Promise.all(spppPromises);
      }

      await session.commitTransaction();
      return NextResponse.json(student, { status: 200 });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error("Ошибка в /api/students PUT:", error);
    await ErrorLog.create({
      errorCode: "UPDATE_STUDENT_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json(
      { error: "Ошибка при обновлении студента" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { user, role } = await authMiddleware(req);
    if (role !== "Admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const studentId = req.url.split("/").pop();
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return NextResponse.json({ error: "Студент не найден" }, { status: 404 });
    }

    await OrphanStatus.deleteMany({ studentId });
    await DisabilityStatus.deleteMany({ studentId });
    await OvzStatus.deleteMany({ studentId });
    await SvoStatus.deleteMany({ studentId });
    await SocialScholarship.deleteMany({ studentId });
    await RiskGroupSop.deleteMany({ studentId });
    await Sppp.deleteMany({ studentId });
    await Dormitory.deleteMany({ studentId });

    return NextResponse.json({ message: "Студент удалён" }, { status: 200 });
  } catch (error: any) {
    await ErrorLog.create({
      errorCode: "DELETE_STUDENT_ERROR",
      message: error.message,
      timestamp: new Date(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
