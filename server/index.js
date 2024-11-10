// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const userRoutes = require("./Routs/User");
const notificationRoutes = require("./Routs/notification"); // Import routes

const app = express();
app.use(cors());
dotenv.config();

app.use(express.json());
const server = http.createServer(app);

// Initialize Socket.io and configure it to allow connections from any origin
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Listen for new notifications
  socket.on("sendNotification", (notification) => {
    io.emit("receiveNotification", notification);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export io after it’s initialized
module.exports = { io };

app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);

mongoose
  .connect(
    "mongodb+srv://root:root@cluster0.cxkta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

server.listen(5000, () => console.log("Server running on port 5000"));
