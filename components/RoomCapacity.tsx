import { User } from "lucide-react";

interface RoomCapacityProps {
  capacity: number;
  occupied: number;
}

export default function RoomCapacity({
  capacity,
  occupied,
}: RoomCapacityProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: capacity }).map((_, index) => (
        <User
          key={index}
          size={20}
          className={index < occupied ? "text-[#0060AC]" : "text-[#737373]"}
        />
      ))}
    </div>
  );
}
