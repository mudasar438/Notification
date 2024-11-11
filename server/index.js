// index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Limit in production
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

io.on("connection", (socket) => {
  // Assume the client sends the `userId` upon connection
  const { userId } = socket.handshake.query;

  if (userId) {
    socket.join(userId); // Place the user in a room identified by their `userId`
    console.log(`User connected: ${userId}`);
  } else {
    console.log("No userId provided, disconnecting...");
    socket.disconnect(); // Disconnect if no userId is provided
  }

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
});

// Endpoint to send a notification to a specific user
app.post("/notify-user", express.json(), (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message are required" });
  }

  // Emit the notification to the specific user's room
  io.to(userId).emit("notification", { message, timestamp: new Date() });
  res.status(200).json({ success: true, message: "Notification sent" });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
