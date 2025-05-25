"use client";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import RoomCapacity from "../../components/RoomCapacity";
import AddRoomModal from "../../components/AddRoomModal";
import RoomDetailsModal from "../../components/RoomDetailsModal";
import dynamic from "next/dynamic";

const DormitoryPDFButton = dynamic(
  () => import("../../components/Report/DormitoryPDFButton"),
  { ssr: false }
);

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  group?: string;
  phone?: string;
  dormitory?: {
    startDate?: string;
    endDate?: string;
    note?: string;
  };
}

interface Room {
  _id: string;
  name: string;
  capacity: number;
  students?: Student[];
}

export default function DormitoryPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/rooms", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Ошибка загрузки комнат");
      const data = await res.json();
      setRooms(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setUserRole(role || "");
      if (!token) {
        window.location.href = "/login";
      }
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (name: string, capacity: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, capacity }),
    });
    if (!res.ok) throw new Error("Ошибка при добавлении комнаты");
    await fetchRooms();
  };

  return (
    <>
      <Header />
      <Container>
        <div className="flex justify-between items-center mb-6 flex-col lg:flex-row gap-4">
          <h1 className="text-3xl font-bold text-[#0060AC]">
            Общежитие: комнаты
          </h1>
          <div className="flex gap-2">
            <DormitoryPDFButton rooms={rooms} />
            {userRole === "Admin" && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#0060AC] hover:bg-[#004080] text-white font-semibold rounded-lg px-6 py-2 transition-colors"
              >
                Добавить комнату
              </Button>
            )}
          </div>
        </div>
        {loading ? (
          <div className="text-center text-[#737373]">Загрузка...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const occupied = room.students?.length || 0;
              return (
                <div
                  key={room._id}
                  className="bg-white border border-[#B0CDE4] rounded-2xl p-5 flex flex-col gap-2"
                >
                  <div className="text-lg font-bold text-[#0060AC]">
                    {room.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[#737373] text-sm">
                      Вместимость: {room.capacity}
                    </div>
                    <RoomCapacity
                      capacity={room.capacity}
                      occupied={occupied}
                    />
                  </div>
                  <div className="text-sm text-[#737373]">
                    Свободно: {room.capacity - occupied} мест
                  </div>
                  <Button
                    onClick={() => setSelectedRoom(room)}
                    className="mt-2 bg-[#0060AC] hover:bg-[#004080] text-white rounded-lg px-4 py-1.5 text-sm self-end"
                  >
                    Подробнее
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Container>

      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRoom}
      />

      {selectedRoom && (
        <RoomDetailsModal
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          room={selectedRoom}
        />
      )}
    </>
  );
}
