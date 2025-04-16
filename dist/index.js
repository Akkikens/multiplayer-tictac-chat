"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const options = process.env.NODE_ENV === "development"
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
const io = new socket_io_1.Server(server, options);
// Track starting player for each game/room
const startingPlayers = new Map();
io.on("connection", (socket) => {
    socket.on("createRoom", (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room) {
            startingPlayers.set(roomId, 2);
            socket.join(roomId);
            socket.data.roomId = roomId;
            socket.emit("roomJoined");
            socket.emit("resetBoard", 2);
        }
        else {
            socket.emit("roomError", "Room already exists");
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
        }
        else {
            socket.emit("roomError", "Room full or does not exist");
        }
    });
    socket.on("gameMove", (idx) => {
        const { roomId } = socket.data;
        if (roomId) {
            socket.to(roomId).emit("gameMove", idx);
        }
        else {
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
        }
        else {
            socket.emit("roomError", "Invalid game state");
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
    app.use(express_1.default.static(path_1.default.join(process.cwd(), "client", "dist")));
    app.get("*", (req, res) => {
        // Using type assertion to let TypeScript know sendFile exists.
        res.sendFile(path_1.default.join(process.cwd(), "client", "dist", "index.html"));
    });
}
const port = parseInt(process.env.PORT || "5000", 10);
server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server listening on port ${port}`);
});
