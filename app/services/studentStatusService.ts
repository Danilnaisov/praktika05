import OrphanStatus from "@/models/OrphanStatus";
import DisabilityStatus from "@/models/DisabilityStatus";
import OvzStatus from "@/models/OvzStatus";
import SvoStatus from "@/models/SvoStatus";
import SocialScholarship from "@/models/SocialScholarship";
import RiskGroupSop from "@/models/RiskGroupSop";
import Dormitory from "@/models/Dormitory";

// --- Группа риска/СОП ---
interface RiskGroupSopData {
  type: string;
  startDate: string;
  reason: string;
  basis: string;
  endDate?: string;
  endReason?: string;
  endBasis?: string;
  note?: string;
}

export const saveRiskGroupSop = async (
  studentId: string,
  data: RiskGroupSopData
) => {
  try {
    if (!data.type || !data.startDate || !data.reason || !data.basis) {
      throw new Error(
        "Не заполнены обязательные поля для статуса 'Группа риска/СОП'"
      );
    }

    const existingStatus = await RiskGroupSop.findOne({ studentId });

    if (existingStatus) {
      existingStatus.type = data.type === "СОП" ? "sop" : "risk";
      existingStatus.startDate = new Date(data.startDate);
      existingStatus.reason = data.reason;
      existingStatus.basis = data.basis;
      existingStatus.endDate = data.endDate
        ? new Date(data.endDate)
        : undefined;
      existingStatus.endReason = data.endReason;
      existingStatus.endBasis = data.endBasis;
      existingStatus.note = data.note;
      await existingStatus.save();
      return existingStatus;
    }

    const newStatus = new RiskGroupSop({
      studentId,
      type: data.type === "СОП" ? "sop" : "risk",
      startDate: new Date(data.startDate),
      reason: data.reason,
      basis: data.basis,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      endReason: data.endReason,
      endBasis: data.endBasis,
      note: data.note,
    });

    await newStatus.save();
    return newStatus;
  } catch (error) {
    console.error("Ошибка при сохранении статуса Группа риска/СОП:", error);
    throw error;
  }
};

// --- Сирота ---
interface OrphanStatusData {
  order: string;
  startDate: string;
  endDate?: string;
  note?: string;
  files?: { fileId: string }[];
}
export async function saveOrphanStatus(
  studentId: string,
  data: OrphanStatusData
) {
  if (!data.order || !data.startDate) return;
  let status = await OrphanStatus.findOne({ studentId });
  const files = data.files?.map((f) => f.fileId) || [];
  if (status) {
    Object.assign(status, {
      order: data.order,
      startDate: data.startDate,
      endDate: data.endDate,
      note: data.note,
      files,
    });
    await status.save();
  } else {
    status = new OrphanStatus({
      studentId,
      order: data.order,
      startDate: data.startDate,
      endDate: data.endDate,
      note: data.note,
      files,
    });
    await status.save();
  }
}

// --- Инвалид ---
interface DisabilityStatusData {
  order: string;
  startDate: string;
  endDate?: string;
  note?: string;
  disabilityType: string;
  files?: { fileId: string }[];
}
export async function saveDisabilityStatus(
  studentId: string,
  data: DisabilityStatusData
) {
  if (!data.order || !data.startDate || !data.disabilityType) return;
  let status = await DisabilityStatus.findOne({ studentId });
  const files = data.files?.map((f) => f.fileId) || [];
  if (status) {
    Object.assign(status, {
      order: data.order,
      startDate: data.startDate,
      endDate: data.endDate,
      note: data.note,
      disabilityType: data.disabilityType,
      files,
    });
    await status.save();
  } else {
    status = new DisabilityStatus({
      studentId,
      order: data.order,
      startDate: data.startDate,
      endDate: data.endDate,
      note: data.note,
      disabilityType: data.disabilityType,
      files,
    });
    await status.save();
  }
}

// --- ОВЗ ---
interface OvzStatusData {
  order: string;
  startDate: string;
  endDate?: string;
  note?: string;
  files?: { fileId: string }[];
}
export async function saveOvzStatus(studentId: string, data: OvzStatusData) {
  if (!data.order || !data.startDate) return;
  let status = await OvzStatus.findOne({ studentId });
  const files = data.files?.map((f) => f.fileId) || [];
  if (status) {
    Object.assign(status, {
      order: data.order,
      startDate: data.startDate,
      endDate: data.endDate,
      note: data.note,
      files,
    });
    await status.save();
  } else {
    status = new OvzStatus({
      studentId,
      order: data.order,
      startDate: data.startDate,
      endDate: data.endDate,
      note: data.note,
      files,
    });
    await status.save();
  }
}

// --- СВО ---
interface SvoStatusData {
  startDate?: string;
  endDate?: string;
  files?: { fileId: string }[];
}

export async function saveSvoStatus(studentId: string, data: SvoStatusData) {
  try {
    // Проверяем, есть ли какие-то данные для сохранения
    if (
      !data.startDate &&
      !data.endDate &&
      (!data.files || data.files.length === 0)
    ) {
      return null;
    }

    if (!data.startDate) {
      throw new Error("Не заполнены обязательные поля для статуса 'СВО'");
    }

    let status = await SvoStatus.findOne({ studentId });
    const files = data.files?.map((f) => f.fileId) || [];

    if (status) {
      Object.assign(status, {
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        files,
      });
      await status.save();
      return status;
    }

    status = new SvoStatus({
      studentId,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      files,
    });
    await status.save();
    return status;
  } catch (error) {
    console.error("Ошибка при сохранении статуса СВО:", error);
    throw error;
  }
}

// --- Социальная стипендия ---
interface SocialScholarshipData {
  startDate: string;
  endDate?: string;
  note?: string;
  files?: { fileId: string }[];
}

export async function saveSocialScholarship(
  studentId: string,
  data: SocialScholarshipData
) {
  try {
    // Проверяем, есть ли какие-то данные для сохранения
    if (
      !data.startDate &&
      !data.endDate &&
      (!data.files || data.files.length === 0) &&
      !data.note
    ) {
      return null;
    }

    if (!data.startDate) {
      throw new Error(
        "Не заполнены обязательные поля для статуса 'Социальная стипендия'"
      );
    }

    let status = await SocialScholarship.findOne({ studentId });
    const files = data.files?.map((f) => f.fileId) || [];

    if (status) {
      Object.assign(status, {
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        note: data.note,
        files,
      });
      await status.save();
      return status;
    }

    status = new SocialScholarship({
      studentId,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      note: data.note,
      files,
    });
    await status.save();
    return status;
  } catch (error) {
    console.error("Ошибка при сохранении статуса Социальная стипендия:", error);
    throw error;
  }
}

// --- Общежитие ---
interface DormitoryData {
  roomId: string;
  startDate: string;
  endDate?: string;
  note?: string;
  files?: Array<{ fileId: string } | string>;
}
export async function saveDormitory(studentId: string, data: DormitoryData) {
  try {
    // Проверяем, есть ли какие-то данные для сохранения
    if (!data.roomId || !data.startDate) {
      return null;
    }

    let dormitory = await Dormitory.findOne({ studentId });
    const files =
      data.files?.map((f) => {
        if (typeof f === "object" && f.fileId) {
          return f.fileId;
        }
        if (typeof f === "string" && f.includes("|")) {
          return f.split("|")[1];
        }
        return f;
      }) || [];

    if (dormitory) {
      Object.assign(dormitory, {
        roomId: data.roomId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        note: data.note,
        files,
      });
      await dormitory.save();
      return dormitory;
    }

    dormitory = new Dormitory({
      studentId,
      roomId: data.roomId,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      note: data.note,
      files,
    });
    await dormitory.save();
    return dormitory;
  } catch (error) {
    console.error("Ошибка при сохранении данных об общежитии:", error);
    throw error;
  }
}
