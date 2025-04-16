import { Kbd } from "@mantine/core";

const Header = () => {
  return (
    <header className="container mt-8 mb-16">
      <h1 className="mb-6 text-center text-[3rem] font-extrabold leading-tight sm:text-6xl">
        <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-purple-600 bg-clip-text text-transparent">Multiplayer</span>
        <br />
        <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-purple-600 bg-clip-text text-transparent">Tic-Tac-Toe</span>
      </h1>

      <p className="mb-4 text-center text-sm font-medium text-gray-400">
        by <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 bg-clip-text font-semibold text-transparent">Akshay Kalapgar</span>
      </p>

      <div className="mx-auto max-w-prose space-y-4 text-center text-gray-100">
        <p>
          Outplay your opponent by lining up three of your symbols in a row! Take turns placing an <Kbd>X</Kbd> or <Kbd>O</Kbd> until someone wins—or it’s a
          draw.
        </p>
        <p>
          Click "New Game" to begin, then share the link with a friend to start playing. Want to chat during the match? Just hit the chat button!{" "}
          <span className="font-bold text-white">Good luck and have fun!</span>
        </p>
      </div>
    </header>
  );
};

export default Header;
