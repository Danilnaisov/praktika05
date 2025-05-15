import mongoose from "mongoose";
import clientPromise from "../lib/mongodb";
import Student from "../models/Student";
import Department from "../models/Department";
import OrphanStatus from "../models/OrphanStatus";
import DisabilityStatus from "../models/DisabilityStatus";
import OVZStatus from "../models/OVZStatus";
import Dormitory from "../models/Dormitory";
import RiskGroupSOP from "../models/RiskGroupSOP";
import SPPP from "../models/SPPP";
import SVOStatus from "../models/SVOStatus";
import SocialScholarship from "../models/SocialScholarship";
import Room from "../models/Room";

async function importData() {
  await clientPromise;
  await mongoose.connect(
    "mongodb://prakrika_admin:somepassword@77.239.125.54:27017/praktika05"
  );

  const department = await Department.create({ name: "ВТ" });
  const room = await Room.create({ name: "422", capacity: 4 });

  const student = await Student.create({
    lastName: "Ощепков",
    firstName: "Александр",
    middleName: "Олегович",
    birthDate: new Date("1998-03-25"),
    gender: "М",
    phone: "+7 (922)-380-17-17",
    education: "9 кл.",
    departmentId: department._id,
    group: "ПИ-14-1",
    funding: "Бюджет",
    admissionYear: 2014,
    graduationYear: 2018,
    expulsionInfo:
      'Отчислен в соответствии с приказом № _ от "_ " 20 г, в связи с окончанием техникума.',
    expulsionDate: new Date("2025-06-16"),
    note: "не учится",
    parentInfo: "",
    penalties: "",
  });

  await OrphanStatus.create({
    studentId: student._id,
    order: 'Приказ №__ от "_ " 20_г',
    startDate: new Date("2025-02-03"),
    endDate: new Date("2025-02-09"),
    note: "",
  });

  await DisabilityStatus.create({
    studentId: student._id,
    order: 'Приказ №__ от "_ " 20_г',
    startDate: new Date("2025-02-03"),
    endDate: new Date("2025-02-09"),
    note: "",
    disabilityType: "Кривые руки",
  });

  await OVZStatus.create({
    studentId: student._id,
    order: 'Приказ №__ от "_ " 20_г',
    startDate: new Date("2025-02-03"),
    endDate: new Date("2025-02-09"),
    note: "",
  });

  await Dormitory.create({
    studentId: student._id,
    roomId: room._id,
    checkInDate: new Date("2025-02-03"),
    checkOutDate: new Date("2025-02-09"),
    note: "",
  });

  await RiskGroupSOP.create({
    studentId: student._id,
    type: "Группа риска",
    registrationDate: new Date("2025-02-03"),
    registrationReason: "Причина постановки на учёт",
    registrationBasis: "Основание постановки на учёт",
    deregistrationDate: new Date("2025-02-09"),
    deregistrationReason: "Причина снятия с учёта",
    deregistrationBasis: "Основание снятия с учёта",
    note: "",
  });

  await SPPP.create({
    studentId: student._id,
    date: new Date("2025-02-03"),
    attendeesEmployees: "Присутствовали сотрудники",
    attendeesRepresentatives: "Присутствовали представители",
    reason: "Причина вызова",
    basis: "Основание вызова",
    decision: "Решение принято",
    note: "",
  });

  await SVOStatus.create({
    studentId: student._id,
    document: 'Приказ №__ от "_ " 20_г',
    startDate: new Date("2025-02-03"),
    endDate: new Date("2025-02-09"),
    note: "",
  });

  await SocialScholarship.create({
    studentId: student._id,
    document: 'Приказ №__ от "_ " 20_г',
    startDate: new Date("2025-02-03"),
    endDate: new Date("2025-02-09"),
    note: "",
  });

  console.log("Данные импортированы");
  await mongoose.disconnect();
  process.exit();
}

importData().catch(console.error);
