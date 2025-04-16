// src/components/App.tsx
import { ActionIcon, Button, Indicator, Loader, TextInput, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Clipboard, MessageCircle } from "tabler-icons-react";
import { SocketRoomStatus, useSocketRoomContext } from "../context/SocketRoom";
import Chat from "./chat/Chat";
import Tictactoe from "./tictactoe/Tictactoe";
import Backdrop from "./ui/Backdrop";

// read the frontend base URL from env (set VITE_FRONTEND_URL on Vercel),
// or else default to whatever origin the app is currently running under.
const BASE_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

const App = () => {
  const { playerId, roomId, roomStatus, roomError, createRoom, joinRoom } = useSocketRoomContext();
  const [showChat, setShowChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const clipboard = useClipboard();

  const isDisconnected = roomStatus === SocketRoomStatus.DISCONNECTED;
  const isConnecting = roomStatus === SocketRoomStatus.CONNECTING;
  const isError = roomStatus === SocketRoomStatus.ERROR;
  const isConnected = roomStatus === SocketRoomStatus.CONNECTED;

  // if there's a ?q=<roomId> param, auto-join
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramsRoomId = params.get("q");
    if (paramsRoomId) {
      joinRoom(paramsRoomId);
      // clean up the URL
      window.history.replaceState(null, "", "/");
    }
  }, [joinRoom]);

  const handleNewGame = () => {
    createRoom(nanoid());
    setUnreadMessages(false);
  };

  const handleToggleChat = () => {
    setShowChat((prev) => !prev);
    if (!showChat) setUnreadMessages(false);
  };

  // build the share link once we have a roomId
  const shareLink = `${BASE_URL}/?q=${roomId}`;

  return (
    <div className="mb-32 flex flex-col justify-center gap-3 md:flex-row">
      <div className="relative overflow-hidden rounded border border-gray-600 bg-gray-700 p-4 sm:p-6">
        {(isDisconnected || (isConnecting && playerId === 1)) && (
          <Backdrop>
            <div className="rounded border border-gray-600 bg-gray-700 py-8 px-12 text-center text-sm">
              <p className="mb-4">Click to start a new game</p>
              <Button loaderPosition="right" loading={isConnecting} variant="default" onClick={handleNewGame}>
                New game
              </Button>
            </div>
          </Backdrop>
        )}

        {isConnected && playerId === 1 && (
          <Backdrop>
            <div className="rounded border border-gray-600 bg-gray-700 py-8 px-12 text-center text-sm">
              <p className="mb-4">
                Share the link below with a friend
                <br />
                to start playing
              </p>
              <TextInput
                rightSection={
                  <Tooltip label="Link copied" opened={clipboard.copied} position="bottom" transition="slide-down" transitionDuration={200} withArrow>
                    <ActionIcon variant="default" onClick={() => clipboard.copy(shareLink)}>
                      <Clipboard size={16} />
                    </ActionIcon>
                  </Tooltip>
                }
                value={shareLink}
                variant="default"
                readOnly
                onFocus={(e) => e.target.select()}
              />
            </div>
          </Backdrop>
        )}

        {isConnecting && playerId === 2 && (
          <Backdrop>
            <div className="rounded border border-gray-600 bg-gray-700 py-8 px-12 text-center text-sm">
              <p className="mb-4">Setting things up</p>
              <Loader className="mx-auto" color="dark" size="md" />
            </div>
          </Backdrop>
        )}

        {isError && (
          <Backdrop>
            <div className="rounded border border-gray-600 bg-gray-700 py-8 px-12 text-center text-sm">
              <p className="mb-2 text-base font-bold">{roomError === "disconnect" ? "A player has disconnected" : "Something went wrong"}</p>
              <p className="mb-4">{roomError === "disconnect" ? "Please create a new game to play again" : "Please try creating a new game"}</p>
              <Button loaderPosition="right" loading={isConnecting} variant="default" onClick={handleNewGame}>
                New game
              </Button>
            </div>
          </Backdrop>
        )}

        <Tictactoe />

        <div className={`absolute top-0 right-0 p-2 sm:p-4 ${isDisconnected ? "z-0" : "z-20"}`}>
          <Indicator color="pink" disabled={!unreadMessages} offset={2} size={12} withBorder>
            <ActionIcon aria-label="toggle chat" size="lg" variant="default" onClick={handleToggleChat}>
              <MessageCircle size={18} />
            </ActionIcon>
          </Indicator>
        </div>
      </div>

      <Chat hidden={!showChat} setUnreadMessages={setUnreadMessages} />
    </div>
  );
};

export default App;
