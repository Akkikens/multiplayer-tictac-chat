import http from "http";
import path from "path";
import express from "express";
import { Server, ServerOptions } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

interface ServerToClientEvents {
  roomJoined: () => void;
  roomLeft: () => void;
  roomError: (errorMessage?: string) => void;
  startGame: () => void;
  gameMove: (boardIdx: number) => void;
  resetBoard: (startingPlayerId: number) => void;
  receiveMessage: (messageText: string) => void;
}
interface ClientToServerEvents {
  createRoom: (roomId: string) => void;
  joinRoom: (roomId: string) => void;
  gameMove: (boardIdx: number) => void;
  resetBoard: () => void;
  sendMessage: (messageText: string) => void;
}
interface InterServerEvents {}
interface SocketData {
  roomId: string;
}

let options: Partial<ServerOptions> = {};
if (process.env.NODE_ENV === "development") {
  options = { cors: { origin: "http://localhost:3000" } };
}
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, options);

// Track starting player for each game/room
const startingPlayers = new Map<string, number>();

io.on("connection", (socket) => {
  socket.on("createRoom", (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) {
      startingPlayers.set(roomId, 2);
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.emit("roomJoined");
      // Player 2 starts first round
      socket.emit("resetBoard", 2);
    } else {
      socket.emit("roomError");
    }
  });

  socket.on("joinRoom", (roomId) => {
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
      socket.emit("roomError");
    }
  });

  socket.on("gameMove", (idx) => {
    const { roomId } = socket.data;
    if (roomId) {
      socket.to(roomId).emit("gameMove", idx);
    } else {
      socket.emit("roomError");
    }
  });

  socket.on("resetBoard", () => {
    const { roomId } = socket.data;
    if (roomId) {
      // Flip starting player every complete round
      const startingPlayer = startingPlayers.get(roomId);
      if (startingPlayer) {
        const newStartingPlayer = (startingPlayer % 2) + 1;
        startingPlayers.set(roomId, newStartingPlayer);
        io.to(roomId).emit("resetBoard", newStartingPlayer);
      }
    } else {
      socket.emit("roomError");
    }
  });

  socket.on("sendMessage", (messageText) => {
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

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server listening on port ${port}`));
