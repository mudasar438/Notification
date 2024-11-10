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

    // Join the user-specific room based on userId received from client-side
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User with ID ${userId} joined their room`);
    });

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

  // Emit the new notification to the specific user's room
  if (io) {
    io.to(req.body.userId).emit("receiveNotification", saved);
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
