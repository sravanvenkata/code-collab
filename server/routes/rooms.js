const express = require("express");
const jwt = require("jsonwebtoken");
const CodeRoom = require("../models/CodeRoom");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFile } = require("child_process");
const { promisify } = require("util");

const router = express.Router();
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const execFileAsync = promisify(execFile);

const canAccessRoom = (room, userId) => {
  if (!room.isPrivate) return true;

  return (
    room.owner.toString() === userId ||
    room.allowedUsers.some((allowedUserId) => allowedUserId.toString() === userId) ||
    room.members.some((memberId) => memberId.toString() === userId)
  );
};

const runJavaScriptInDocker = async (sourceCode) => {
  const sandboxDir = fs.mkdtempSync(path.join(os.tmpdir(), "codecollab-"));
  const sourceFile = path.join(sandboxDir, "main.js");

  fs.writeFileSync(sourceFile, sourceCode, "utf8");

  try {
    const { stdout, stderr } = await execFileAsync(
      "docker",
      [
        "run",
        "--rm",
        "--network",
        "none",
        "--cpus",
        "0.5",
        "--memory",
        "128m",
        "--pids-limit",
        "64",
        "--read-only",
        "--tmpfs",
        "/tmp:rw,noexec,nosuid,size=64m",
        "-v",
        `${sandboxDir}:/workspace:ro`,
        "-w",
        "/workspace",
        "node:20-alpine",
        "node",
        "main.js"
      ],
      {
        timeout: 5000,
        maxBuffer: 1024 * 1024,
      }
    );

    return {
      stdout,
      stderr,
      exitCode: 0,
      timedOut: false,
    };
  } catch (error) {
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || error.message || "Execution failed",
      exitCode: typeof error.code === "number" ? error.code : 1,
      timedOut: Boolean(error.killed),
    };
  } finally {
    fs.rmSync(sandboxDir, { recursive: true, force: true });
  }
};

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
  !room.allowedUsers.some((userId) => userId.toString() === req.user.userId) &&
  !room.members.some((userId) => userId.toString() === req.user.userId)
) {
  return res.sendStatus(403);
}

  res.json(room);
});

router.post("/run", auth, async (req, res) => {
  const { roomId, code } = req.body;

  if (!roomId || typeof code !== "string") {
    return res.status(400).json({ error: "roomId and code are required" });
  }

  const room = await CodeRoom.findOne({ roomId });

  if (!room) return res.sendStatus(404);
  if (!canAccessRoom(room, req.user.userId)) return res.sendStatus(403);

  const result = await runJavaScriptInDocker(code);
  res.json(result);
});


module.exports = router;
