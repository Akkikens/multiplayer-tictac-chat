const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // for dev — restrict in prod
  },
});

// Map to track the starting player for each game room
const startingPlayers = new Map();

io.on("connection", (socket) => {
  socket.on("createRoom", (roomId) => {
    // If the room doesn't exist, create it.
    if (!io.sockets.adapter.rooms.has(roomId)) {
      startingPlayers.set(roomId, 2);
      socket.join(roomId);
      // Save the room ID on the socket.
      socket.roomId = roomId;
      socket.emit("roomJoined");
      socket.emit("resetBoard", 2);
    } else {
      socket.emit("roomError", "Room already exists");
    }
  });

  socket.on("joinRoom", (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room && room.size < 2) {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.emit("roomJoined");

      // If two players are connected, start the game.
      if (room.size === 2) {
        io.to(roomId).emit("startGame");
      }
    } else {
      socket.emit("roomError", "Room full or does not exist");
    }
  });

  socket.on("gameMove", (idx) => {
    if (socket.roomId) {
      io.to(socket.roomId).emit("gameMove", idx);
    }
  });

  socket.on("resetBoard", () => {
    if (socket.roomId) {
      const current = startingPlayers.get(socket.roomId) || 1;
      const next = current === 1 ? 2 : 1;
      startingPlayers.set(socket.roomId, next);
      io.to(socket.roomId).emit("resetBoard", next);
    }
  });

  socket.on("sendMessage", (msg) => {
    if (socket.roomId) {
      io.to(socket.roomId).emit("receiveMessage", msg);
    }
  });

  socket.on("disconnect", () => {
    if (socket.roomId) {
      startingPlayers.delete(socket.roomId);
      io.to(socket.roomId).emit("roomError", "disconnect");
      io.to(socket.roomId).emit("roomLeft");
    }
  });
});

// If you plan to serve static files in production (for example, a built client),
// uncomment the following lines and adjust the path as needed:
// app.use(express.static(path.join(process.cwd(), "client", "dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "client", "dist", "index.html"));
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
