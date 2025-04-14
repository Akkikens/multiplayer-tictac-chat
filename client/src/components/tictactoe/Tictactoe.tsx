import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { SocketRoomStatus, useSocketRoomContext } from "../../context/SocketRoom";
import socket from "../../services/socket";
import { checkWinner } from "../../utils/tictactoe";
import Backdrop from "../ui/Backdrop";
import Board from "./Board";
import Scoreboard from "./Scoreboard";

const DEFAULT_BOARD = Array(9).fill(null);
enum GameResult {
  WIN = 1,
  TIE,
  LOSS,
}

const Tictactoe = () => {
  const { playerId, roomStatus } = useSocketRoomContext();
  const [board, setBoard] = useState([...DEFAULT_BOARD]);
  const [activePlayer, setActivePlayer] = useState<number | null>(null);
  const [scores, setScores] = useState([0, 0]);
  const [result, setResult] = useState<GameResult | null>(null);

  const isPlayerIdle = activePlayer !== playerId;
  const isError = roomStatus === SocketRoomStatus.ERROR;
  const isPlaying = roomStatus === SocketRoomStatus.PLAYING;

  useEffect(() => {
    // Check for winner on board change
    const winnerId = checkWinner(board);
    if (winnerId) {
      setActivePlayer(null);
      setScores((prev) => prev.map((val, i) => (i === winnerId - 1 ? val + 1 : val)));
      if (winnerId === playerId) {
        setResult(GameResult.WIN);
      } else {
        setResult(GameResult.LOSS);
      }
    } else {
      if (board.indexOf(null) === -1) {
        setActivePlayer(null);
        setScores((prev) => prev.map((val) => val + 1));
        setResult(GameResult.TIE);
      }
    }
  }, [board, playerId]);

  useEffect(() => {
    setActivePlayer(2);

    socket.on("roomJoined", () => {
      setScores([0, 0]);
    });
    socket.on("gameMove", (boardIdx) => {
      if (!playerId) {
        return;
      }
      const otherPlayerId = (playerId % 2) + 1;
      setBoard((prev) => prev.map((val, idx) => (idx === boardIdx ? otherPlayerId : val)));
      setActivePlayer(playerId);
    });
    socket.on("resetBoard", (startingPlayer) => {
      setBoard([...DEFAULT_BOARD]);
      setActivePlayer(startingPlayer);
      setResult(null);
    });

    return () => {
      socket.off("roomJoined");
      socket.off("gameMove");
      socket.off("resetBoard");
    };
  }, [playerId]);

  const handleBoardClick = (boardIdx: number) => {
    if (!playerId || isPlayerIdle || board[boardIdx]) {
      return;
    }
    socket.emit("gameMove", boardIdx);
    setBoard((prev) => prev.map((val, i) => (i === boardIdx ? playerId : val)));
    setActivePlayer((playerId % 2) + 1);
  };

  const handlePlayAgain = () => {
    socket.emit("resetBoard");
  };

  return (
    <>
      {result && !isError && (
        <Backdrop>
          <div className="rounded border border-gray-600 bg-gray-700 py-8 px-12 text-center text-sm">
            <h3 className="mb-4 text-base font-bold">
              {result === GameResult.WIN && "You win!"}
              {result === GameResult.TIE && "Tie!"}
              {result === GameResult.LOSS && "You lose"}
            </h3>
            <Button variant="default" onClick={handlePlayAgain}>
              Play again
            </Button>
          </div>
        </Backdrop>
      )}
      <div className="mb-6">
        <Scoreboard activePlayer={activePlayer} isPlaying={isPlaying} playerId={playerId} scores={scores} />
        <div className="mt-2">
          <p className={`text-primary text-center ${isPlaying ? "" : "invisible"}`}>
            {isPlayerIdle ? (playerId === 2 ? "Player 1's turn" : "Player 2's turn") : "Your turn"}
          </p>
        </div>
      </div>

      <Board board={board} handleCellClick={handleBoardClick} isPlayerIdle={isPlayerIdle} />
    </>
  );
};

export default Tictactoe;
