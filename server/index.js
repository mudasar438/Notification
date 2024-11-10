const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./Routs/User");
const {
  router: notificationRoutes,
  initializeSocket,
} = require("./Routs/notification");

const app = express();
dotenv.config();

app.use(express.json());
const server = http.createServer(app);

// -------------------  Socket.io  ------------------------
const io = new Server(server, { cors: { origin: "*" } });

// Initialize Socket.io in the notifications route
initializeSocket(io);

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
