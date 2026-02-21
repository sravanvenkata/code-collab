import { Users, Lock, Globe, LogOut } from "lucide-react";
import { disconnectSocket } from "../socket";

export default function TopBar({ room, onToggleUsers }) {
  const logout = () => {
    localStorage.removeItem("token");
    disconnectSocket();
    window.location.href = "/login";
  };

  return (
    <div className="h-14 flex items-center justify-between px-6 bg-card border-b border-slate-800">
      {/* Left */}
      <div className="font-semibold">CodeCollab</div>

      {/* Center */}
      <div className="flex flex-col items-center leading-tight">
  <span className="font-semibold text-sm text-slate-400">
    {room.roomName || "Untitled Room"}
  </span>

  <span className="text-xs text-slate-400 font-mono">
    {room.roomId}
  </span>
</div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleUsers}
          className="text-slate-400 hover:text-white"
          title="People in room"
        >
          <Users size={18} />
        </button>

        <button
          onClick={logout}
          className="text-slate-400 hover:text-red-400"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}