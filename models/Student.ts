import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: [true, "Фамилия обязательна"],
  },
  firstName: {
    type: String,
    required: [true, "Имя обязательно"],
  },
  middleName: {
    type: String,
  },
  birthDate: {
    type: Date,
    required: [true, "Дата рождения обязательна"],
  },
  group: {
    type: String,
    required: [true, "Группа обязательна"],
  },
  phone: {
    type: String,
    required: [true, "Телефон обязателен"],
    match: [/^\+7 \(\d{3}\)-\d{3}-\d{2}-\d{2}$/, "Неверный формат телефона"],
  },
  funding: {
    type: String,
    required: [true, "Финансирование обязательно"],
    enum: ["Бюджет", "Контракт", "Платное"],
  },
  education: {
    type: String,
    required: [true, "Образование обязательно"],
    enum: ["9 кл.", "11 кл.", "СПО", "ВО"],
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: [true, "Отделение обязательно"],
  },
  admissionYear: {
    type: Number,
    required: [true, "Год поступления обязателен"],
    match: [/^\d{4}$/, "Год поступления должен быть 4-значным числом"],
  },
  graduationYear: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
    enum: ["Мужской", "Женский", null],
  },
  expulsionInfo: {
    type: String,
  },
  orphanStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrphanStatus",
  },
  disabilityStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DisabilityStatus",
  },
  ovzStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OVZStatus",
  },
  riskGroupSOP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RiskGroupSOP",
  },
  svoStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SVOStatus",
  },
  socialScholarship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SocialScholarship",
  },
});

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);
