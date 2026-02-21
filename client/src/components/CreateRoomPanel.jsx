import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { createRoom } from "../api/rooms";
import { useNavigate } from "react-router-dom";


export default function CreateRoomPanel({ onClose }) {
  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

//   const createRoom = () => {
//     if (!roomName.trim()) return;
//     // API call comes next
//   };
  const navigate = useNavigate();

const createRoomHandler = async () => {
  if (!roomName.trim()) return;

  const room = await createRoom(roomName, isPrivate);
  onClose();
  navigate(`/room/${room.roomId}`);
};



  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-card z-50 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create Room</h2>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-slate-400">
              Room Name
            </label>
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="DSA Practice"
              className="w-full mt-2 px-4 py-3 rounded-lg bg-bg border border-slate-700 outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Private Room
            </span>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-12 h-6 rounded-full transition ${
                isPrivate ? "bg-accent" : "bg-slate-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transform transition ${
                  isPrivate ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <button
  onClick={createRoomHandler}
  className="w-full bg-accent py-3 rounded-lg font-semibold hover:opacity-90"
>
  Create
</button>

        </div>
      </motion.div>
    </>
  );
}
