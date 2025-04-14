import { ActionIcon, ScrollArea, TextInput } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { Send } from "tabler-icons-react";
import { SocketRoomStatus, useSocketRoomContext } from "../../context/SocketRoom";
import { Message } from "../../types/message";
import MessageItem from "./MessageItem";

interface ChatProps {
  hidden: boolean;
  setUnreadMessages: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chat = ({ hidden, setUnreadMessages }: ChatProps) => {
  const { playerId, roomStatus, messages, sendMessage } = useSocketRoomContext();
  const [input, setInput] = useState("");
  const viewport = useRef<HTMLDivElement>(null);
  const lastMessage = useRef<Message | null>(null);

  const isDisconnected = roomStatus === SocketRoomStatus.DISCONNECTED || roomStatus === SocketRoomStatus.CONNECTING || !playerId;

  useEffect(() => {
    // Scroll to bottom of chat on new message
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, hidden]);

  useEffect(() => {
    // Track "unread messages" for chat notification indicator
    const incomingMessage = messages.at(-1);
    if (hidden && incomingMessage && incomingMessage !== lastMessage.current && !incomingMessage.isAuthor) {
      setUnreadMessages(true);
    }
    lastMessage.current = messages.at(-1) || null;
  }, [messages, hidden, setUnreadMessages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <>
      {!hidden && (
        <div className="rounded border border-gray-600 bg-gray-700 md:self-start">
          <ScrollArea className="h-[375px] overflow-x-hidden md:w-[275px]" type="auto" viewportRef={viewport} offsetScrollbars>
            <div className="space-y-3 whitespace-normal p-2">
              {messages.map((message, idx) => (
                <MessageItem key={idx} message={message} playerId={playerId} />
              ))}
            </div>
          </ScrollArea>
          <div className="border-t border-gray-600 p-1">
            <form onSubmit={handleSubmit}>
              <TextInput
                disabled={isDisconnected}
                placeholder="Your message"
                rightSection={
                  <ActionIcon aria-label="send message" disabled={isDisconnected} type="submit">
                    <Send color="gray" size={16} />
                  </ActionIcon>
                }
                value={input}
                variant="default"
                onChange={(e) => setInput(e.target.value)}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
