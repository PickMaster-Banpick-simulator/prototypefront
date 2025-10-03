import { useParams } from "react-router-dom";
import { useRoomStore } from "../store/roomStore";

export default function RoomPage() {
  const { roomId } = useParams();
  const { rooms } = useRoomStore();
  const room = rooms.find((r) => r.id === Number(roomId));

  if (!room) return <div className="p-6">방을 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">{room.name} (ID: {roomId})</h1>
      <p>👉 여기에 팀 배정 / 밴픽 / 채팅 UI 들어감</p>
    </div>
  );
}
