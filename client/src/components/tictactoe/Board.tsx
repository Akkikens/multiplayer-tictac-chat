import { Circle, X } from "../ui/icons";

interface BoardProps {
  board: number[];
  isPlayerIdle: boolean;
  handleCellClick: (idx: number) => void;
}

const Board = ({ board, isPlayerIdle, handleCellClick }: BoardProps) => {
  return (
    <div className="grid grid-cols-3 sm:px-8">
      {board.map((val, idx) => {
        const borderClasses = [];
        if (idx < 3) {
          borderClasses.push("border-b");
        }
        if (idx > 5) {
          borderClasses.push("border-t");
        }
        if (idx % 3 === 0) {
          borderClasses.push("border-r");
        }
        if ((idx + 1) % 3 === 0) {
          borderClasses.push("border-l");
        }
        return (
          <div key={idx} className={`aspect-square border-gray-400 ${borderClasses.join(" ")}`}>
            <button
              className="flex h-full w-full items-center justify-center disabled:cursor-default"
              disabled={isPlayerIdle}
              onClick={() => handleCellClick(idx)}
            >
              {!val && <svg className="w-[65%] max-w-[10rem]"></svg>}
              {val === 1 && <X className="w-[65%] max-w-[10rem]" />}
              {val === 2 && <Circle className="w-[65%] max-w-[10rem]" />}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Board;
