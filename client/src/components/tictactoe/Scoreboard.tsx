import { Circle, X } from "../ui/icons";

interface ScoreboardProps {
  scores: number[];
  playerId: number | null;
  activePlayer: number | null;
  isPlaying: boolean;
}

const Scoreboard = ({ scores, playerId, activePlayer, isPlaying }: ScoreboardProps) => {
  const xScore = (
    <div className="relative flex h-20 w-20 items-center justify-center text-center">
      <div className="relative z-10">
        <p className="font-semibold">{playerId === 1 ? "You" : "Player 1"}</p>
        <span className="text-4xl font-bold">{scores[0]}</span>
      </div>
      <X className={`absolute inset-0 opacity-25 ${isPlaying && activePlayer === 1 ? "" : "!text-gray-300"}`} />
    </div>
  );
  const oScore = (
    <div className="relative flex h-20 w-20 items-center justify-center text-center">
      <div className="relative z-10">
        <p className="font-semibold">{playerId === 2 ? "You" : "Player 2"}</p>
        <span className="text-4xl font-bold">{scores[1]}</span>
      </div>
      <Circle className={`absolute inset-0 opacity-25 ${isPlaying && activePlayer === 2 ? "" : "!text-gray-300"}`} />
    </div>
  );

  return (
    <div className="grid justify-items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
      <div>{!playerId || playerId === 1 ? xScore : oScore}</div>
      <span className="self-center px-2 text-3xl font-bold sm:px-0 ">:</span>
      <div>{!playerId || playerId === 1 ? oScore : xScore}</div>
    </div>
  );
};

export default Scoreboard;
