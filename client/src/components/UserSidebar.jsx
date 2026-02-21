import { X } from "lucide-react";

export default function UsersSidebar({ users, isOwner, onKick }) {
  return (
    <div className="w-64 bg-card border-l border-slate-800 p-4">
      <h3 className="font-semibold mb-4">
        People in Room ({users.length})
      </h3>

      <ul className="space-y-2">
        {users.map(u => (
          <li
            key={u.userId}
            className="flex justify-between items-center text-sm text-white"
          >
            <span>
              {u.username}
              {u.isOwner && (
                <span className="ml-2 text-xs text-accent">
                  OWNER
                </span>
              )}
            </span>

            {isOwner && !u.isOwner && (
              <button
                onClick={() => onKick(u.userId)}
                className="text-red-400 hover:text-red-300"
              >
                <X size={14} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}