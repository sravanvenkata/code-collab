const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`, {
    headers: authHeader(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to load rooms");
  }
  return res.json();
}

export async function createRoom(roomName, isPrivate) {
  const res = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ roomName, isPrivate }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to create room");
  }
  return res.json();
}

export async function deleteRoom(roomId) {
  const res = await fetch(`${API_URL}/rooms/${roomId}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to delete room");
  }
}

export async function getRoom(roomId) {
  const res = await fetch(`${API_URL}/rooms/${roomId}`, {
    headers: authHeader(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Room access denied");
  }
  return res.json();
}

export async function runCode(roomId, code) {
  const res = await fetch(`${API_URL}/rooms/run`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ roomId, code }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Code execution failed");
  }

  return res.json();
}

