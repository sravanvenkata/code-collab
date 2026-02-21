const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function createRoom(roomName, isPrivate) {
  const res = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ roomName, isPrivate }),
  });
  return res.json();
}

export async function deleteRoom(roomId) {
  await fetch(`${API_URL}/rooms/${roomId}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}

export async function getRoom(roomId) {
  const res = await fetch(`${API_URL}/rooms/${roomId}`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Room access denied");
  return res.json();
}

