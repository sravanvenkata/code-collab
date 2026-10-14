import { io } from "socket.io-client";

let socket = null;
let activeToken = null;
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ensureSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found, socket not created");
    return null;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ["websocket"],
    });
    activeToken = token;
    return socket;
  }

  if (activeToken !== token) {
    socket.disconnect();
    socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ["websocket"],
    });
    activeToken = token;
    return socket;
  }

  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    activeToken = null;
  }
};