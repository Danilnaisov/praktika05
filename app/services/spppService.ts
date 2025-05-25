import Sppp from "@/models/Sppp";

interface SpppMeeting {
  date?: string;
  staff?: string;
  representatives?: string;
  reason?: string;
  decision?: string;
  note?: string;
}

export async function saveSpppMeetings(
  studentId: string,
  meetings: SpppMeeting[]
) {
  await Sppp.deleteMany({ studentId });
  for (const [i, meeting] of meetings.entries()) {
    if (
      meeting.date &&
      meeting.staff &&
      meeting.representatives &&
      meeting.reason &&
      meeting.decision
    ) {
      const newMeeting = new Sppp({
        studentId,
        date: meeting.date,
        attendeesEmployees: meeting.staff,
        attendeesRepresentatives: meeting.representatives,
        reason: meeting.reason,
        basis: meeting.reason,
        decision: meeting.decision,
        note: meeting.note || "",
      });
      await newMeeting.save();
    } else if (
      meeting.date ||
      meeting.staff ||
      meeting.representatives ||
      meeting.reason ||
      meeting.decision
    ) {
      throw new Error(
        `Не заполнены обязательные поля для встречи СППП №${i + 1}`
      );
    }
  }
}
