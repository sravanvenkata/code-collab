const mongoose = require("mongoose");

const CodeRoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, unique: true },
    roomName: { type: String, required: true },
    code: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPrivate: { type: Boolean, default: false },
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodeRoom", CodeRoomSchema);
