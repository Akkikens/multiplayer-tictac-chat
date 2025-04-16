import { io, Socket } from "socket.io-client";

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

// Use environment variable VITE_HOST (or default to localhost)
const SOCKET_URL =
  import.meta.env.VITE_HOST || "http://localhost:5001";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  SOCKET_URL,
  {
    transports: ["websocket"],
  }
);

export default socket;
