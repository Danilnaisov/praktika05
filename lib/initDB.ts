/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config";
import mongoose from "mongoose";
import connectToDatabase from "./mongodb";
import { hashPassword } from "../utils/auth";
import Student from "../models/Student";
import OrphanStatus from "../models/OrphanStatus";
import DisabilityStatus from "../models/DisabilityStatus";
import OVZStatus from "../models/OvzStatus";
import Dormitory from "../models/Dormitory";
import RiskGroupSOP from "../models/RiskGroupSop";
import SPPP from "../models/Sppp";
import SVOStatus from "../models/SvoStatus";
import SocialScholarship from "../models/SocialScholarship";
import Department from "../models/Department";
import Room from "../models/Room";
import File from "../models/File";
import User from "../models/User";

async function initDB() {
  await connectToDatabase();

  // Очистка данных
  await Promise.all([
    Student.deleteMany({}),
    OrphanStatus.deleteMany({}),
    DisabilityStatus.deleteMany({}),
    OVZStatus.deleteMany({}),
    Dormitory.deleteMany({}),
    RiskGroupSOP.deleteMany({}),
    SPPP.deleteMany({}),
    SVOStatus.deleteMany({}),
    SocialScholarship.deleteMany({}),
    Department.deleteMany({}),
    Room.deleteMany({}),
    File.deleteMany({}),
    User.deleteMany({}),
  ]);

  // Создание отделов
  const departments = await Department.insertMany([
    { name: "ВТ" },
    { name: "АД" },
    { name: "МП" },
  ]);

  // Создание комнат
  const rooms = await Room.insertMany([
    { name: "101", capacity: 4 },
    { name: "102", capacity: 3 },
  ]);

  // Создание студентов
  const students = await Student.insertMany([
    {
      lastName: "Иванов",
      firstName: "Иван",
      middleName: "Иванович",
      birthDate: new Date("2000-01-01"),
      gender: "M",
      phone: "+7 (999)-123-45-67",
      education: "11 кл.",
      departmentId: departments[0]._id,
      group: "ВТ-21",
      funding: "Бюджет",
      admissionYear: 2021,
      graduationYear: 2025,
      note: "Хороший студент",
    },
    {
      lastName: "Петрова",
      firstName: "Мария",
      middleName: "Сергеевна",
      birthDate: new Date("2002-03-15"),
      gender: "K",
      phone: "+7 (999)-987-65-43",
      education: "9 кл.",
      departmentId: departments[1]._id,
      group: "АД-22",
      funding: "Внебюджет",
      admissionYear: 2022,
      graduationYear: 2026,
    },
  ]);

  // Создание файлов
  const files = await File.insertMany([
    {
      entityId: students[0]._id,
      entityType: "Student",
      path: "/uploads/ivanov.pdf",
      uploadedAt: new Date(),
    },
    {
      entityId: students[1]._id,
      entityType: "Student",
      path: "/uploads/petrova.pdf",
      uploadedAt: new Date(),
    },
  ]);

  // Обновление студентов с файлами
  await Student.updateOne(
    { _id: students[0]._id },
    { $set: { files: [files[0]._id] } }
  );
  await Student.updateOne(
    { _id: students[1]._id },
    { $set: { files: [files[1]._id] } }
  );

  // Создание пользователя
  await User.create({
    username: "admin",
    password: await hashPassword("admin123"),
    role: "Admin",
  });

  await mongoose.disconnect();
  process.exit();
}

initDB().catch(console.error);
