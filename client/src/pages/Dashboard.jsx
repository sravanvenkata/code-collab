import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateRoomPanel from "../components/CreateRoomPanel";
import { getRooms, deleteRoom } from "../api/rooms";
import RoomCard from "../components/RoomCard";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";



export default function Dashboard() {
  const [showPanel, setShowPanel] = useState(false);
  const [ownedRooms, setOwnedRooms] = useState([]);
  const [sharedRooms, setSharedRooms] = useState([]);
  const [joinInput, setJoinInput] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
const user = token ? jwtDecode(token) : null;

  useEffect(() => {
  getRooms().then(({ owned, shared }) => {
    setOwnedRooms(owned);
    setSharedRooms(shared);
  });
}, []);

const handleDelete = async (roomId) => {
  const ok = confirm("Delete this room permanently?");
  if (!ok) return;

  await deleteRoom(roomId);
  setOwnedRooms(ownedRooms.filter(r => r.roomId !== roomId));
};


  return (
    <div className="min-h-screen bg-bg text-white p-8 relative">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-semibold">Dashboard</h1>

  <div className="text-sm text-slate-400">
    Logged in as <span className="text-white font-medium">{user?.username}</span>
  </div>

        <button
          onClick={() => setShowPanel(true)}
          className="bg-accent px-5 py-2 rounded-lg font-semibold hover:opacity-90"
        >
          + Create Room
        </button>
        <div className="mt-6 max-w-md">
  <label className="block text-sm text-slate-400 mb-2">
    Join a room
  </label>

  <div className="flex gap-2">
    <input
      value={joinInput}
      onChange={(e) => setJoinInput(e.target.value)}
      placeholder="Room ID or full link"
      className="flex-1 px-4 py-2 rounded-lg bg-card border border-slate-700 outline-none focus:border-accent"
    />

    <button
      onClick={() => {
        if (!joinInput.trim()) return;

        let id = joinInput.trim();

        // Allow full URL paste
        if (id.includes("/room/")) {
          id = id.split("/room/")[1];
        }

        navigate(`/room/${id}`);
      }}
      className="bg-slate-700 px-4 rounded-lg hover:bg-slate-600"
    >
      Join
    </button>
  </div>
</div>
      </div>

      {ownedRooms.map(room => (
  <RoomCard
    key={room.roomId}
    room={room}
    isOwner
    onDelete={handleDelete}
  />
))}



      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Your Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownedRooms.length === 0 && (
            <p className="text-slate-400">No rooms yet</p>
          )}
        </div>
      </section>

      {sharedRooms.map(room => (
  <RoomCard
    key={room.roomId}
    room={room}
    isOwner={false}
  />
))}
      <section>
        <h2 className="text-lg font-semibold mb-4">Shared With You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sharedRooms.length === 0 && (
            <p className="text-slate-400">No shared rooms</p>
          )}
        </div>
      </section>

      {/* Slide-in Panel */}
      <AnimatePresence>
        {showPanel && (
          <CreateRoomPanel onClose={() => setShowPanel(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
