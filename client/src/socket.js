import { io } from "socket.io-client";

let socket = null;

export const ensureSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found, socket not created");
    return null;
  }

  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: token
      },
      transports: ["websocket"],
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};