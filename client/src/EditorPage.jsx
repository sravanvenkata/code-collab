import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import TopBar from "./components/TopBar";
import { ensureSocket} from "./socket";
import { getRoom, runCode as runRoomCode } from './api/rooms';
import UsersSidebar from "./components/UserSidebar";
import { jwtDecode } from 'jwt-decode'

function EditorPage() {
  const { roomId } = useParams();
  const [code, setCode] = useState("");
  const [runOutput, setRunOutput] = useState("Click Run to execute code.");
  const [isRunning, setIsRunning] = useState(false);
  const typingRef = useRef(false);
  const debounceRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const token = localStorage.getItem("token");
const currentUser = token ? jwtDecode(token) : null;
const currentUserId = currentUser?.userId;
const toggleUsers = () => setShowUsers(prev => !prev);

const socketRef = useRef(null);
if (!socketRef.current) {
  socketRef.current = ensureSocket();
}

const socket = socketRef.current;


useEffect(() => {
  if (!socket || !roomId) return;

  const joinRoom = () => {
    socket.emit("join-room", roomId);
  };

  const handleCodeUpdate = (newCode) => {
    setCode(newCode);
  };

  const handleRoomUsers = ({ users }) => {
    setUsers(users);
  };

  const handleUserKicked = ({ userId }) => {
    if (userId === currentUserId) {
      alert("You were removed from the room");
      window.location.href = "/dashboard";
    }
  };

  socket.on("connect", joinRoom);
  socket.on("code-update", handleCodeUpdate);
  socket.on("room-users", handleRoomUsers);
  socket.on("user-kicked", handleUserKicked);

  joinRoom();

  return () => {
    socket.off("connect", joinRoom);
    socket.off("code-update", handleCodeUpdate);
    socket.off("room-users", handleRoomUsers);
    socket.off("user-kicked", handleUserKicked);
  };
}, [socket, roomId, currentUserId]);
useEffect(() => {
  getRoom(roomId)
    .then((data) => {
      setRoom(data);
      setCode(data.code || "");
    })
    .catch(() => {
      alert("Access denied or room fetch failed");
    });
}, [roomId]);

const kickUser = (userId) => {
  socket.emit("kick-user", {
    roomId,
    targetUserId: userId
  });
};

  const handleChange = (value) => {
    const nextCode = value || "";
    setCode(nextCode);
    typingRef.current = true;
    if(debounceRef.current){
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(()=>
    {
      if (socket) {
        socket.emit("code-change", {
      roomId,
      code: nextCode
    });
      }
    typingRef.current = false;
    },300);
    
  };

  const runCode = async () => {
    if (!code.trim()) {
      setRunOutput("Write some code before running it.");
      return;
    }

    setIsRunning(true);
    setRunOutput("Running code...");

    try {
      const result = await runRoomCode(roomId, code);
      const sections = [];

      if (result.stdout?.trim()) {
        sections.push(`stdout:\n${result.stdout}`);
      }

      if (result.stderr?.trim()) {
        sections.push(`stderr:\n${result.stderr}`);
      }

      if (result.timedOut) {
        sections.push("Execution timed out.");
      }

      if (typeof result.exitCode === "number" && result.exitCode !== 0) {
        sections.push(`Exit code: ${result.exitCode}`);
      }

      setRunOutput(sections.length ? sections.join("\n\n") : "Program finished with no output.");
    } catch (error) {
      setRunOutput(error.message);
    } finally {
      setIsRunning(false);
    }
  };

 if (!room) return <div style={{ color: "white" }}>LOADING ROOM...</div>;

return (
  <div className="h-screen flex flex-col">
    <TopBar
      room={room}
      onToggleUsers={toggleUsers}
      runCode={runCode}
      onLeaveRoom={() => {
        window.location.href = "/dashboard";
      }}
    />
    <div className="flex flex-1 overflow-hidden">
  <div className="flex flex-1 flex-col overflow-hidden">
    <div className="flex-1 overflow-hidden p-2">
      <Editor
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleChange}
      />
    </div>

    <div className="border-t border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-200 h-48 overflow-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-white">Run Output</h3>
        <span className="text-xs text-slate-400">
          {isRunning ? "Running..." : "Ready"}
        </span>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-slate-300">{runOutput}</pre>
    </div>
  </div>

  {showUsers && (
    <div className="w-64 border-l border-slate-800">
      <UsersSidebar
        users={users}
        isOwner={String(room.owner) === String(currentUserId)}
        onKick={kickUser}
      />
    </div>
  )}
</div>
  </div>
);

}

export default EditorPage;
