import { Request, Response } from "express";
import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import type { Socket } from "socket.io/dist/socket";
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

interface SocketData {
  roomId: string;
}

const options =
  process.env.NODE_ENV === "development"
    ? {
        cors: {
          origin: "http://localhost:3000",
        },
      }
    : {
        cors: {
          origin: "https://multiplayer-tictac-chat.vercel.app",
        },
      };

const io = new Server(server, options);

// Track starting player for each game/room
const startingPlayers = new Map<string, number>();

io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
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
  
  app.get("*", (req: Request, res: Response) => {
    // Using type assertion to let TypeScript know sendFile exists.
    (res as any).sendFile(path.join(process.cwd(), "client", "dist", "index.html"));
  });
}

const port = parseInt(process.env.PORT || "5000", 10);

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${port}`);
});
