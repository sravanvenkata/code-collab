import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import TopBar from "./components/TopBar";
import { ensureSocket} from "./socket";
import { getRoom } from './api/rooms';
import UsersSidebar from "./components/UserSidebar";
import { jwtDecode } from 'jwt-decode'

function EditorPage() {
  const { roomId } = useParams();
  const [code, setCode] = useState("");
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

  if (socket.connected) {
    socket.emit("join-room", roomId);
  } else {
    socket.on("connect", () => {
      socket.emit("join-room", roomId);
    });
  }

  const handleCodeUpdate = (newCode) => {
    if (!typingRef.current) {
      setCode(newCode);
    }
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

  socket.on("code-update", handleCodeUpdate);
  socket.on("room-users", handleRoomUsers);
  socket.on("user-kicked", handleUserKicked);

  return () => {
    socket.off("code-update", handleCodeUpdate);
    socket.off("room-users", handleRoomUsers);
    socket.off("user-kicked", handleUserKicked);
    socket.off("connect");
  };
}, [roomId]);
useEffect(() => {
  getRoom(roomId)
    .then((data) => {
      setRoom(data);
    })
    .catch((err) => {
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
    setCode(value);
    typingRef.current = true;
    if(debounceRef.current){
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(()=>
    {
      socket.emit("code-change", {
      roomId,
      code: value
    });
    typingRef.current = false;
    },300);
    
  };

 if (!room) return <div style={{ color: "white" }}>LOADING ROOM...</div>;

return (
  <div className="h-screen flex flex-col">
    <TopBar room={room} onToggleUsers={toggleUsers}/>
    <div className="flex flex-1 overflow-hidden">
  <div className="flex-1 overflow-hidden p-2">
    <Editor
      height="100%"
      language="javascript"
      theme="vs-dark"
      value={code}
      onChange={handleChange}
    />
  </div>

  {showUsers && (
    <div className="w-64 border-l border-slate-800">
      <UsersSidebar
        users={users}
        isOwner={room.owner === currentUserId}
        onKick={kickUser}
      />
    </div>
  )}
</div>
  </div>
);

}

export default EditorPage;
