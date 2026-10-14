const express = require('express');
const http = require('http');
const { Server} = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const CodeRoom = require('./models/CodeRoom');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL?.trim();
const roomUsers = {};
const roomOwners = {};

const emitRoomUsers = (io, roomId, roomOwnerId = roomOwners[roomId]) => {
  io.to(roomId).emit("room-users", {
    users: Object.entries(roomUsers[roomId] || {}).map(([id, u]) => ({
      userId: id,
      username: u.username,
      isOwner: id === roomOwnerId
    }))
  });
};

mongoose.connect(process.env.MONGODB_URI)
    .then(()=> console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

const app = express();
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ['GET','POST'],
    },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on('connection',(socket)=>{
    socket.data.joinedRooms = new Set();

    socket.on("join-room", async (roomId) => {
  let room = await CodeRoom.findOne({ roomId });

  if (!room) {
    room = await CodeRoom.create({
      roomId,
      roomName: "Untitled",
      owner: socket.user.userId,
      code: "",
      isPrivate: false,
      allowedUsers: [],
      members:[]
    });
  }

  if (
    room.isPrivate &&
    room.owner.toString() !== socket.user.userId &&
    !room.allowedUsers.some((userId) => userId.toString() === socket.user.userId) &&
    !room.members.some((userId) => userId.toString() === socket.user.userId)
  )
   {
    socket.emit("error-message", "Access denied");
    return;
  }
  // Add user as member if not already
if (!room.members) room.members = [];

if (!room.members.some((userId) => userId.toString() === socket.user.userId)) {
  room.members.push(socket.user.userId);
  await room.save();
}

  const alreadyJoined = socket.data.joinedRooms.has(roomId);

  if (!roomUsers[roomId]) roomUsers[roomId] = {};
  roomOwners[roomId] = room.owner.toString();

  const userId = socket.user.userId;
  const username = socket.user.username;

  if (!alreadyJoined) {
    socket.join(roomId);
    socket.data.joinedRooms.add(roomId);

    if (!roomUsers[roomId][userId]) {
      roomUsers[roomId][userId] = {
        username,
        socketCount: 0
      };
    }

    roomUsers[roomId][userId].socketCount++;
  }

 
  emitRoomUsers(io, roomId);

  socket.emit("code-update", room.code);
});
socket.on("code-change", async ({ roomId, code }) => {
  socket.to(roomId).emit("code-update", code);
  await CodeRoom.findOneAndUpdate(
    { roomId },
    { code }
  );
});

socket.on("make-room-private", async (roomId) => {
  const room = await CodeRoom.findOne({ roomId });

  if (!room) return;

  if (room.owner.toString() !== socket.user.userId) {
    return;
  }

  room.isPrivate = true;
  await room.save();
});
socket.on("add-user-to-room", async ({ roomId, userId }) => {
  const room = await CodeRoom.findOne({ roomId });

  if (room.owner.toString() !== socket.user.userId) return;

  if (!room.allowedUsers.some((allowedUserId) => allowedUserId.toString() === userId)) {
    room.allowedUsers.push(userId);
    await room.save();
  }
});

socket.on("kick-user", async ({ roomId, targetUserId }) => {
  const room = await CodeRoom.findOne({ roomId });
  if (!room) return;

  // Only owner can kick
  if (room.owner.toString() !== socket.user.userId) {
    socket.emit("error-message", "Only owner can kick users");
    return;
  }

  // Remove user from presence
  if (roomUsers[roomId]) {
    delete roomUsers[roomId][targetUserId];
  }

  // Notify kicked user
  io.to(roomId).emit("user-kicked", {
    userId: targetUserId
  });

  // Broadcast updated user list
  roomOwners[roomId] = room.owner.toString();
  emitRoomUsers(io, roomId);
});

socket.on("disconnect", () => {
  for (const roomId of socket.data.joinedRooms) {
    if (!roomUsers[roomId]) continue;

    const user = roomUsers[roomId][socket.user.userId];
    if (!user) continue;

    user.socketCount--;

    if (user.socketCount <= 0) {
      delete roomUsers[roomId][socket.user.userId];

      if (Object.keys(roomUsers[roomId]).length === 0) {
        delete roomUsers[roomId];
        delete roomOwners[roomId];
      }
    }

    emitRoomUsers(io, roomId);
  }
});

});

app.use(express.json());
app.use('/auth',require('./routes/auth'));
app.use('/rooms',require('./routes/rooms') );

server.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
});
