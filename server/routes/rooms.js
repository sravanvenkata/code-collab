const express = require("express");
const jwt = require("jsonwebtoken");
const CodeRoom = require("../models/CodeRoom");

const router = express.Router();
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
};

// Create room
router.post("/", auth, async (req, res) => {
  const { roomName, isPrivate } = req.body;

  const roomId = crypto.randomUUID();

  const room = await CodeRoom.create({
    roomId,
    roomName,
    owner: req.user.userId,
    isPrivate,
    allowedUsers: [],
    members:[req.user.userId]
  });

  res.json(room);
});

// Get rooms for dashboard
router.get("/", auth, async (req, res) => {
  const userId = req.user.userId;

  // Rooms you own
  const owned = await CodeRoom.find({
    owner: userId
  });

  // Rooms you joined but do not own
  const shared = await CodeRoom.find({
    owner: { $ne: userId },
    members: userId
  });

  res.json({ owned, shared });
});

// Delete room
router.delete("/:roomId", auth, async (req, res) => {
  const room = await CodeRoom.findOne({ roomId: req.params.roomId });

  if (!room) return res.sendStatus(404);
  if (room.owner.toString() !== req.user.userId) return res.sendStatus(403);

  await room.deleteOne();
  res.sendStatus(204);
});

// Get single room
router.get("/:roomId", auth, async (req, res) => {
  const room = await CodeRoom.findOne({ roomId: req.params.roomId });
  if (!room) return res.sendStatus(404);

  // access check
  if (
  room.isPrivate &&
  room.owner.toString() !== req.user.userId &&
  !room.allowedUsers.includes(req.user.userId) &&
  !room.members.includes(req.user.userId)
) {
  return res.sendStatus(403);
}

  res.json(room);
});


module.exports = router;
