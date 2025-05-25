import { Types } from "mongoose";

export interface IStudent {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  gender: "М" | "Ж";
  phone: string;
  education: "9 кл." | "11 кл.";
  departmentId: Types.ObjectId;
  group: string;
  funding: "Бюджет" | "Внебюджет";
  admissionYear: number;
  graduationYear: number;
  expulsionInfo?: string;
  expulsionDate?: Date;
  note?: string;
  parentInfo?: string;
  penalties?: string;
  files?: Types.ObjectId[];
  orphanStatus?: IOrphanStatus;
  disabilityStatus?: IDisabilityStatus;
  ovzStatus?: IOvzStatus;
  dormitory?: IDormitory;
  riskGroupSop?: IRiskGroupSop;
  sppp?: ISppp[];
  svoStatus?: ISvoStatus;
  socialScholarship?: ISocialScholarship;
}

export interface IOrphanStatus {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  order: string;
  startDate: Date;
  endDate?: Date;
  note?: string;
  files?: Types.ObjectId[];
}

export interface IDisabilityStatus {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  order: string;
  startDate: Date;
  endDate?: Date;
  note?: string;
  disabilityType: string;
  files?: Types.ObjectId[];
}

export interface IOvzStatus {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  order: string;
  startDate: Date;
  endDate?: Date;
  note?: string;
  files?: Types.ObjectId[];
}

export interface IDormitory {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  roomId: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  note?: string;
  files?: Types.ObjectId[];
}

export interface IRiskGroupSop {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  type: "sop" | "risk";
  startDate: Date;
  reason: string;
  basis: string;
  endDate?: Date;
  endReason?: string;
  endBasis?: string;
  note?: string;
  documents?: Types.ObjectId[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISppp {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  date: Date;
  attendeesEmployees: string;
  attendeesRepresentatives: string;
  reason: string;
  basis: string;
  decision: string;
  note?: string;
}

export interface ISvoStatus {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  note?: string;
  files?: Types.ObjectId[];
}

export interface ISocialScholarship {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  note?: string;
  files?: Types.ObjectId[];
}

export interface IDepartment {
  _id?: Types.ObjectId;
  name: string;
}

export interface IRoom {
  _id?: string;
  name: string;
  capacity: number;
  students?: string[] | IStudent[];
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFile {
  _id?: Types.ObjectId;
  entityId: Types.ObjectId;
  entityType:
    | "Student"
    | "OrphanStatus"
    | "DisabilityStatus"
    | "OvzStatus"
    | "Dormitory"
    | "SvoStatus"
    | "SocialScholarship";
  path: string;
  uploadedAt: Date;
}

export interface IUser {
  _id?: Types.ObjectId;
  username: string;
  password: string;
  role: "Admin" | "Teacher";
}

export interface IErrorLog {
  _id?: Types.ObjectId;
  errorCode: string;
  message: string;
  timestamp: Date;
}
