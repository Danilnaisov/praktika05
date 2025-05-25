"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RoomCapacity from "./RoomCapacity";
import dynamic from "next/dynamic";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
}

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    _id: string;
    name: string;
    capacity: number;
    students?: Student[];
  };
}

const DormitoryPDFButton = dynamic(
  () => import("./Report/DormitoryPDFButton"),
  { ssr: false }
);

export default function RoomDetailsModal({
  isOpen,
  onClose,
  room,
}: RoomDetailsModalProps) {
  const occupied = room.students?.length || 0;
  const free = room.capacity - occupied;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Комната {room.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#737373]">
              Вместимость: {room.capacity} мест
            </div>
            <RoomCapacity capacity={room.capacity} occupied={occupied} />
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-[#0060AC]">Проживающие:</div>
            {room.students && room.students.length > 0 ? (
              <div className="space-y-1">
                {room.students.map((student) => (
                  <div key={student._id} className="text-sm">
                    {student.lastName} {student.firstName} {student.middleName}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-[#737373]">Нет проживающих</div>
            )}
          </div>

          <div className="text-sm">
            <span className="font-semibold text-[#0060AC]">
              Свободных мест:
            </span>{" "}
            {free}
          </div>

          <div className="flex justify-end gap-2">
            {room.students && room.students.length > 0 && (
              <DormitoryPDFButton rooms={[room]} />
            )}
            <Button onClick={onClose}>Закрыть</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
