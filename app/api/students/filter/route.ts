import { NextResponse } from "next/server";
import initMongoose from "@/lib/mongodb";
import Student from "@/models/Student";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await initMongoose();

    const { searchParams } = new URL(request.url);
    const lastName = searchParams.get("lastName");
    const group = searchParams.get("group");
    const asOfDate = searchParams.get("asOfDate");
    const hasOrphanStatus = searchParams.get("hasOrphanStatus");
    const hasDisabilityStatus = searchParams.get("hasDisabilityStatus");
    const hasOVZStatus = searchParams.get("hasOVZStatus");
    const hasRiskGroupSOP = searchParams.get("hasRiskGroupSOP");
    const hasSVOStatus = searchParams.get("hasSVOStatus");
    const hasSocialScholarship = searchParams.get("hasSocialScholarship");

    const query: any = {};
    if (lastName) query.lastName = { $regex: lastName, $options: "i" };
    if (group) query.group = group;

    const statusFilter: any = asOfDate
      ? {
          $or: [
            { endDate: { $gte: new Date(asOfDate) } },
            { endDate: null },
            { deregistrationDate: { $gte: new Date(asOfDate) } },
            { deregistrationDate: null },
          ],
          startDate: { $lte: new Date(asOfDate) },
        }
      : {};

    let studentIds: mongoose.Types.ObjectId[] = [];

    if (hasOrphanStatus === "true") {
      const orphanStatuses = await mongoose
        .model("OrphanStatus")
        .find(statusFilter)
        .select("studentId");
      studentIds = orphanStatuses.map((s) => s.studentId);
      query._id = { $in: studentIds };
    }
    if (hasDisabilityStatus === "true") {
      const disabilityStatuses = await mongoose
        .model("DisabilityStatus")
        .find(statusFilter)
        .select("studentId");
      studentIds = disabilityStatuses.map((s) => s.studentId);
      query._id = query._id
        ? { $in: studentIds.filter((id) => query._id.$in.includes(id)) }
        : { $in: studentIds };
    }
    if (hasOVZStatus === "true") {
      const ovzStatuses = await mongoose
        .model("OVZStatus")
        .find(statusFilter)
        .select("studentId");
      studentIds = ovzStatuses.map((s) => s.studentId);
      query._id = query._id
        ? { $in: studentIds.filter((id) => query._id.$in.includes(id)) }
        : { $in: studentIds };
    }
    if (hasRiskGroupSOP === "true") {
      const riskGroups = await mongoose
        .model("RiskGroupSOP")
        .find(statusFilter)
        .select("studentId");
      studentIds = riskGroups.map((s) => s.studentId);
      query._id = query._id
        ? { $in: studentIds.filter((id) => query._id.$in.includes(id)) }
        : { $in: studentIds };
    }
    if (hasSVOStatus === "true") {
      const svoStatuses = await mongoose
        .model("SVOStatus")
        .find(statusFilter)
        .select("studentId");
      studentIds = svoStatuses.map((s) => s.studentId);
      query._id = query._id
        ? { $in: studentIds.filter((id) => query._id.$in.includes(id)) }
        : { $in: studentIds };
    }
    if (hasSocialScholarship === "true") {
      const socialScholarships = await mongoose
        .model("SocialScholarship")
        .find(statusFilter)
        .select("studentId");
      studentIds = socialScholarships.map((s) => s.studentId);
      query._id = query._id
        ? { $in: studentIds.filter((id) => query._id.$in.includes(id)) }
        : { $in: studentIds };
    }


    const students = await Student.find(query)
      .populate({
        path: "departmentId",
        model: "Department",
      })
      .lean();

    // Дополняем студентов данными о статусах
    const studentIdsSet = new Set(students.map((s) => s._id.toString()));
    const statuses = await Promise.all([
      mongoose
        .model("OrphanStatus")
        .find({
          studentId: { $in: Array.from(studentIdsSet) },
          ...statusFilter,
        })
        .lean(),
      mongoose
        .model("DisabilityStatus")
        .find({
          studentId: { $in: Array.from(studentIdsSet) },
          ...statusFilter,
        })
        .lean(),
      mongoose
        .model("OVZStatus")
        .find({
          studentId: { $in: Array.from(studentIdsSet) },
          ...statusFilter,
        })
        .lean(),
      mongoose
        .model("RiskGroupSOP")
        .find({
          studentId: { $in: Array.from(studentIdsSet) },
          ...statusFilter,
        })
        .lean(),
      mongoose
        .model("SVOStatus")
        .find({
          studentId: { $in: Array.from(studentIdsSet) },
          ...statusFilter,
        })
        .lean(),
      mongoose
        .model("SocialScholarship")
        .find({
          studentId: { $in: Array.from(studentIdsSet) },
          ...statusFilter,
        })
        .lean(),
    ]);

    const [
      orphanStatuses,
      disabilityStatuses,
      ovzStatuses,
      riskGroupSOPs,
      svoStatuses,
      socialScholarships,
    ] = statuses;

    const studentsWithStatuses = students.map((student) => ({
      ...student,
      orphanStatus: orphanStatuses.find(
        (s) => s.studentId.toString() === student._id.toString()
      ),
      disabilityStatus: disabilityStatuses.find(
        (s) => s.studentId.toString() === student._id.toString()
      ),
      ovzStatus: ovzStatuses.find(
        (s) => s.studentId.toString() === student._id.toString()
      ),
      riskGroupSOP: riskGroupSOPs.find(
        (s) => s.studentId.toString() === student._id.toString()
      ),
      svoStatus: svoStatuses.find(
        (s) => s.studentId.toString() === student._id.toString()
      ),
      socialScholarship: socialScholarships.find(
        (s) => s.studentId.toString() === student._id.toString()
      ),
    }));

    await mongoose.disconnect();
    return NextResponse.json(studentsWithStatuses || []);
  } catch (error) {
    await mongoose.disconnect();
    return NextResponse.json(
      { error: error.message, students: [] },
      { status: 500 }
    );
  }
}
