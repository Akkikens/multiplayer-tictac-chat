import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "../services/socket";
import { Message, MessageType } from "../types/message";

export enum SocketRoomStatus {
  DISCONNECTED,
  CONNECTING,
  ERROR,
  CONNECTED,
  PLAYING,
}

interface SocketRoomContextInterface {
  playerId: number | null;
  roomId: string;
  roomStatus: SocketRoomStatus;
  roomError: string;
  messages: Message[];
  createRoom: (roomId: string) => void;
  joinRoom: (roomId: string) => void;
  sendMessage: (message: string) => void;
}

export const SocketRoomContext = createContext<SocketRoomContextInterface | null>(null);

export const SocketRoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState("");
  const [roomStatus, setRoomStatus] = useState(SocketRoomStatus.DISCONNECTED);
  const [roomError, setRoomError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("roomJoined", () => {
      setRoomStatus(SocketRoomStatus.CONNECTED);
      setMessages([{ type: MessageType.STATUS, datetime: Date.now(), isAuthor: true, text: "You have connected" }]);
    });
    socket.on("roomError", (errorMessage) => {
      setRoomStatus(SocketRoomStatus.ERROR);
      if (errorMessage) {
        setRoomError(errorMessage);
      }
    });
    socket.on("roomLeft", () => {
      if (playerId) {
        const otherPlayerId = (playerId % 2) + 1;
        setMessages((prev) => [...prev, { type: MessageType.STATUS, datetime: Date.now(), isAuthor: false, text: `Player ${otherPlayerId} has disconnected` }]);
      }
    });
    socket.on("startGame", () => {
      setRoomStatus(SocketRoomStatus.PLAYING);
      if (playerId === 1) {
        setMessages((prev) => [...prev, { type: MessageType.STATUS, datetime: Date.now(), isAuthor: false, text: "Player 2 has connected" }]);
      }
    });
    socket.on("receiveMessage", (messageText) => {
      setMessages((prev) => [...prev, { type: MessageType.USER, datetime: Date.now(), isAuthor: false, text: messageText }]);
    });

    return () => {
      socket.off("roomJoined");
      socket.off("roomError");
      socket.off("roomLeft");
      socket.off("startGame");
      socket.off("receiveMessage");
    };
  }, [playerId]);

  const createRoom = (roomId: string) => {
    socket.emit("createRoom", roomId);
    setPlayerId(1);
    setRoomId(roomId);
    setRoomStatus(SocketRoomStatus.CONNECTING);
    setMessages([]);
  };

  const joinRoom = (roomId: string) => {
    socket.emit("joinRoom", roomId);
    setPlayerId(2);
    setRoomId(roomId);
    setRoomStatus(SocketRoomStatus.CONNECTING);
  };

  const sendMessage = (messageText: string) => {
    socket.emit("sendMessage", messageText);
    setMessages((prev) => [...prev, { type: MessageType.USER, datetime: Date.now(), isAuthor: true, text: messageText }]);
  };

  return (
    <SocketRoomContext.Provider value={{ playerId, roomId, roomStatus, roomError, messages, createRoom, joinRoom, sendMessage }}>
      {children}
    </SocketRoomContext.Provider>
  );
};

export const useSocketRoomContext = () => {
  const context = useContext(SocketRoomContext);

  if (!context) {
    throw new Error("No provider for SocketRoomContext found");
  }

  return context;
};
