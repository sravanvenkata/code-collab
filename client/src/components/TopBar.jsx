import { Users, Play, LogOut, CircleDot } from "lucide-react";
import { disconnectSocket } from "../socket";

export default function TopBar({ room, onToggleUsers, runCode, onLeaveRoom }) {
  const leaveRoom = () => {
    disconnectSocket();
    if (onLeaveRoom) {
      onLeaveRoom();
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="relative flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 py-3 text-white shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-inner shadow-cyan-400/10">
          <CircleDot size={18} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide text-white">CodeCollab</div>
          <div className="text-xs text-slate-400">Realtime collaborative editor</div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 justify-center px-3">
        <div className="flex max-w-[min(100%,38rem)] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shadow-lg shadow-black/10">
          <div className="min-w-0 text-center">
            <div className="truncate text-sm font-semibold text-white">
              {room.roomName || "Untitled Room"}
            </div>
            <div className="truncate font-mono text-[11px] text-slate-400">
              {room.roomId}
            </div>
          </div>

          <button
            onClick={runCode}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
            title="Run code"
          >
            <Play size={15} className="fill-slate-950" />
            Run
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleUsers}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-white"
          title="People in room"
          aria-label="Toggle people sidebar"
        >
          <Users size={18} />
        </button>

        <button
          onClick={leaveRoom}
          className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300"
          title="Leave room"
          aria-label="Leave room"
        >
          <LogOut size={18} />
          <span className="hidden text-sm font-medium sm:inline">Leave room</span>
        </button>
      </div>
    </div>
  );
}