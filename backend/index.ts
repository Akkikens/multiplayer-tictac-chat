import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const options = process.env.NODE_ENV === "development"
  ? {
      cors: {
        origin: "http://localhost:3000",
      },
    }
  : {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
      },
    };

const io = new Server(server, options);

// Track starting player for each game room
const startingPlayers = new Map<string, number>();

io.on("connection", (socket) => {
  socket.on("createRoom", (roomId: string) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) {
      startingPlayers.set(roomId, 2);
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.emit("roomJoined");
      socket.emit("resetBoard", 2);
    } else {
      socket.emit("roomError", "Room already exists");
    }
  });

  socket.on("joinRoom", (roomId: string) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room && room.size < 2) {
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.emit("roomJoined");
      const updatedRoom = io.sockets.adapter.rooms.get(roomId);
      if (updatedRoom && updatedRoom.size === 2) {
        io.to(roomId).emit("startGame");
      }
    } else {
      socket.emit("roomError", "Room full or does not exist");
    }
  });

  socket.on("gameMove", (idx: number) => {
    const { roomId } = socket.data;
    if (roomId) {
      socket.to(roomId).emit("gameMove", idx);
    } else {
      socket.emit("roomError", "Invalid game state");
    }
  });

  socket.on("resetBoard", () => {
    const { roomId } = socket.data;
    if (roomId) {
      const startingPlayer = startingPlayers.get(roomId);
      if (startingPlayer) {
        const newStartingPlayer = (startingPlayer % 2) + 1;
        startingPlayers.set(roomId, newStartingPlayer);
        io.to(roomId).emit("resetBoard", newStartingPlayer);
      }
    } else {
      socket.emit("roomError", "Invalid game state");
    }
  });

  socket.on("sendMessage", (messageText: string) => {
    const { roomId } = socket.data;
    if (roomId) {
      socket.to(roomId).emit("receiveMessage", messageText);
    }
  });

  socket.on("disconnect", () => {
    const { roomId } = socket.data;
    if (roomId) {
      startingPlayers.delete(roomId);
      io.to(roomId).emit("roomError", "disconnect");
      io.to(roomId).emit("roomLeft");
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "client", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client", "dist", "index.html"));
  });
}

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
