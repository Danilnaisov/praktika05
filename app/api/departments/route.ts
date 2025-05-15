import { NextResponse } from "next/server";
import initMongoose from "@/lib/mongodb";
import Department from "@/models/Department";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  try {
    await initMongoose();
    console.log("Fetching departments...");
    const departments = await Department.find().lean();
    if (!departments.length) {
      console.log("No departments found");
    }
    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error in GET /api/departments:", error);
    return NextResponse.json(
      { error: error.message || "Не удалось загрузить отделения" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(["Admin"]);
  if (auth instanceof Response) return auth;

  try {
    await initMongoose();
    const { name, code } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: "Название обязательно" },
        { status: 400 }
      );
    }
    console.log("Creating department:", { name, code });
    const department = await Department.create({
      name,
      code: code ? code.toUpperCase() : undefined,
    });
    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/departments:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при создании отделения" },
      { status: 400 }
    );
  }
}
