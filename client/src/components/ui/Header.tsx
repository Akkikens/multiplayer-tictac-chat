import { Kbd } from "@mantine/core";

const Header = () => {
  return (
    <header className="container mt-8 mb-16">
      <h1 className="mb-8 text-center text-[3rem] font-black leading-none sm:text-6xl">
        <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Multiplayer</span>
        <br></br>
        <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Tic-Tac-Toe</span>
      </h1>
      <div className="mx-auto max-w-prose space-y-4 text-center">
        <p>
          The goal of Tic-Tac-Toe is to place three of your symbols in a row. Players take turns marking either an <Kbd>X</Kbd> or an <Kbd>O</Kbd> on the board
          until one of them forms a row of three or all nine spaces are filled, resulting in a draw.
        </p>
        <p>
          To start, click the "New Game" button and share the generated link with a friend to play together. You can also chat with your opponent by using the
          chat button. <span className="font-bold">Have fun and good luck!</span>
        </p>
      </div>
    </header>
  );
};

export default Header;
