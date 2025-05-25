import { Schema, model, models } from "mongoose";
import { IStudent } from "../types";

const studentSchema = new Schema<IStudent>({
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[А-Яа-яA-Za-z]+$/.test(v),
      message: "Фамилия должна содержать только буквы",
    },
  },
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[А-Яа-яA-Za-z]+$/.test(v),
      message: "Имя должно содержать только буквы",
    },
  },
  middleName: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[А-Яа-яA-Za-z]+$/.test(v),
      message: "Отчество должно содержать только буквы",
    },
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["М", "Ж"],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\+7 \(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(v),
      message: "Номер телефона должен быть в формате +7 (XXX)-XXX-XX-XX",
    },
  },
  education: {
    type: String,
    enum: ["9 кл.", "11 кл."],
    required: true,
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  funding: {
    type: String,
    enum: ["Бюджет", "Внебюджет"],
    required: true,
  },
  admissionYear: {
    type: Number,
    required: true,
    validate: {
      validator: (v: number) => /^\d{4}$/.test(v.toString()),
      message: "Год поступления должен быть числом",
    },
  },
  graduationYear: {
    type: Number,
    required: true,
    validate: {
      validator: (v: number) => /^\d{4}$/.test(v.toString()),
      message: "Год окончания должен быть числом",
    },
  },
  expulsionInfo: {
    type: String,
  },
  expulsionDate: {
    type: Date,
  },
  note: {
    type: String,
  },
  parentInfo: {
    type: String,
  },
  penalties: {
    type: String,
  },
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
      populate: true,
    },
  ],
});

export default models.Student || model<IStudent>("Student", studentSchema);
