// routes/notifications.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Function to initialize Socket.io
let io;
const initializeSocket = (socketIoInstance) => {
  io = socketIoInstance;

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

// Get notifications for a specific user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const notifications = await Notification.find({ userId });
  res.json(notifications);
});

// Add a new notification and emit it in real-time
router.post("/addNotification", async (req, res) => {
  const notification = new Notification({
    userId: req.body.userId,
    message: `this is a Notification`,
  });

  const saved = await notification.save();
  res.json(saved);

  // Emit the new notification to all connected clients
  if (io) {
    io.emit("newNotification", saved);
  }
});

// Mark a notification as read
router.put("/:id", async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });
  res.json(notification);
});

module.exports = { router, initializeSocket };
