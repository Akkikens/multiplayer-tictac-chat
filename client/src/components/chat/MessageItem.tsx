import { Message, MessageType } from "../../types/message";

interface MessageItemProps {
  message: Message;
  playerId: number | null;
}

const MessageItem = ({ message, playerId }: MessageItemProps) => {
  const { type, datetime, isAuthor, text } = message;

  if (!playerId) {
    return null;
  }

  // Status message
  if (type === MessageType.STATUS) {
    return (
      <div className={`text-tertiary text-center text-sm italic`}>
        <p className="space-x-1">
          <span>
            (<time dateTime={new Date(datetime).toLocaleTimeString()}>{new Date(datetime).toLocaleTimeString("en-US", { timeStyle: "short" })}</time>)
          </span>
          <span>{text}</span>
        </p>
      </div>
    );
  }

  // User message
  return (
    <div className="flex flex-col">
      <div
        className={`mb-0.5 rounded-md bg-opacity-80 px-2 py-1 text-white ${
          isAuthor ? "ml-4 self-end bg-gray-400" : `mr-4 self-start ${playerId !== 1 ? "bg-cyan-600" : "bg-pink-600"}`
        }`}
      >
        <p>{text}</p>
      </div>
      <p className={`text-tertiary space-x-1 text-xs ${isAuthor ? "text-right" : "text-left"}`}>
        <span>{isAuthor ? "You" : `Player ${(playerId % 2) + 1}`}</span>
        <span>
          (<time dateTime={new Date(datetime).toLocaleTimeString()}>{new Date(datetime).toLocaleTimeString("en-US", { timeStyle: "short" })}</time>)
        </span>
      </p>
    </div>
  );
};

export default MessageItem;
