import { NextResponse } from "next/server";
import initMongoose from "@/lib/mongodb";
import Student from "@/models/Student";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  try {
    await initMongoose();
    const { searchParams } = new URL(request.url);
    const filters: any = {};
    if (searchParams.get("lastName"))
      filters.lastName = new RegExp(searchParams.get("lastName"), "i");
    if (searchParams.get("firstName"))
      filters.firstName = new RegExp(searchParams.get("firstName"), "i");
    if (searchParams.get("group"))
      filters.group = new RegExp(searchParams.get("group"), "i");
    if (searchParams.get("departmentId"))
      filters.departmentId = searchParams.get("departmentId");
    if (searchParams.get("admissionYear"))
      filters.admissionYear = Number(searchParams.get("admissionYear"));

    console.log("Fetching students with filters:", filters);
    const students = await Student.find(filters)
      .populate({
        path: "departmentId",
        model: "Department",
        select: "_id name code",
      })
      .lean();
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error in GET /api/students:", error);
    return NextResponse.json(
      { error: error.message || "Не удалось загрузить студентов" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  try {
    await initMongoose();
    const data = await request.json();

    if (
      !data.lastName ||
      !data.firstName ||
      !data.birthDate ||
      !data.group ||
      !data.phone ||
      !data.funding ||
      !data.departmentId?._id ||
      !data.education ||
      !data.admissionYear
    ) {
      return NextResponse.json(
        { error: "Все обязательные поля должны быть заполнены" },
        { status: 400 }
      );
    }
    if (!/^\+7 \(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(data.phone)) {
      return NextResponse.json(
        { error: "Неверный формат телефона" },
        { status: 400 }
      );
    }
    if (new Date(data.birthDate) >= new Date()) {
      return NextResponse.json(
        { error: "Дата рождения должна быть в прошлом" },
        { status: 400 }
      );
    }
    if (!/^\d{4}$/.test(data.admissionYear.toString())) {
      return NextResponse.json(
        { error: "Год поступления должен быть 4-значным числом" },
        { status: 400 }
      );
    }
    if (!["Бюджет", "Контракт", "Платное"].includes(data.funding)) {
      return NextResponse.json(
        { error: "Неверное значение финансирования" },
        { status: 400 }
      );
    }
    if (!["9 кл.", "11 кл.", "СПО", "ВО"].includes(data.education)) {
      return NextResponse.json(
        { error: "Неверное значение образования" },
        { status: 400 }
      );
    }
    const departmentExists = await mongoose
      .model("Department")
      .exists({ _id: data.departmentId._id });
    if (!departmentExists) {
      return NextResponse.json(
        { error: "Указанное отделение не существует" },
        { status: 400 }
      );
    }

    console.log("Creating student:", data);
    const student = await Student.create({
      ...data,
      departmentId: data.departmentId._id,
      graduationYear: data.graduationYear || undefined,
      gender: data.gender || undefined,
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/students:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при создании студента" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAuth(["Admin"]);
  if (auth instanceof Response) return auth;

  try {
    await initMongoose();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Неверный ID студента" },
        { status: 400 }
      );
    }
    console.log("Deleting student with ID:", id);
    const hasLinks = await Promise.any([
      mongoose.model("OrphanStatus").exists({ studentId: id }),
      mongoose.model("DisabilityStatus").exists({ studentId: id }),
      mongoose.model("OVZStatus").exists({ studentId: id }),
      mongoose.model("Dormitory").exists({ studentId: id }),
      mongoose.model("RiskGroupSOP").exists({ studentId: id }),
      mongoose.model("SPPP").exists({ studentId: id }),
      mongoose.model("SVOStatus").exists({ studentId: id }),
      mongoose.model("SocialScholarship").exists({ studentId: id }),
    ]);
    if (hasLinks) {
      return NextResponse.json(
        { error: "Нельзя удалить студента, связанного с другими модулями" },
        { status: 400 }
      );
    }
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return NextResponse.json({ error: "Студент не найден" }, { status: 404 });
    }
    return NextResponse.json({ message: "Студент удалён" });
  } catch (error) {
    console.error("Error in DELETE /api/students:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при удалении студента" },
      { status: 400 }
    );
  }
}
