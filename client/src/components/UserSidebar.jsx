import { X } from "lucide-react";

export default function UsersSidebar({ users, isOwner, onKick }) {
  const totalUsers = users.length;

  return (
    <aside className="flex h-full w-72 flex-col border-l border-white/10 bg-slate-950/95 text-white shadow-[-20px_0_50px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-wide text-white">People in Room</div>
            <div className="mt-1 text-xs text-slate-400">{totalUsers} connected</div>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
            {isOwner ? "Owner view" : "Member view"}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {totalUsers === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-slate-400">
            Waiting for someone to join this room.
          </div>
        ) : (
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.userId}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 transition hover:border-cyan-400/20 hover:bg-white/[0.06]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">
                    {u.username?.[0]?.toUpperCase() || "?"}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-white">
                        {u.username}
                      </span>
                      {u.isOwner && (
                        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                          Owner
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {u.isOwner ? "Room host" : "Member"}
                    </div>
                  </div>
                </div>

                {isOwner && !u.isOwner && (
                  <button
                    onClick={() => onKick(u.userId)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300 opacity-80 transition hover:scale-105 hover:bg-rose-400/20 hover:text-rose-200 group-hover:opacity-100"
                    title={`Kick ${u.username}`}
                    aria-label={`Kick ${u.username}`}
                  >
                    <X size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}