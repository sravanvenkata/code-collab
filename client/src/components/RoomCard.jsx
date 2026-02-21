import { Trash2, Lock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoomCard({ room, isOwner, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{room.roomName}</h3>
          {room.isPrivate ? (
            <Lock size={16} className="text-slate-400" />
          ) : (
            <Globe size={16} className="text-slate-400" />
          )}
        </div>

        <p className="text-xs text-slate-400 mt-1 font-mono">
          {room.roomId}
        </p>

        <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-slate-800">
          {isOwner ? "OWNER" : "MEMBER"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4">
       <button
  onClick={() => navigate(`/room/${room.roomId}`)}
  className="text-sm text-accent hover:underline"
>
  {isOwner ? "Open" : "Join"}
</button>


        {isOwner && (
          <button
            onClick={() => onDelete(room.roomId)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
