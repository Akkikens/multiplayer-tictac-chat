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
          The objective of Tic-Tac-Toe is to get three tiles in a row. Two players alternate placing either an <Kbd>X</Kbd> or an <Kbd>O</Kbd> on the game board
          until either player has three in a row or all nine squares are filled, resulting in a tie.
        </p>
        <p>
          Begin by clicking the new game button and sending the link created to a friend to play together. You can also send messages to the other player
          connected by clicking the chat button. <span className="font-bold">Good luck, have fun!</span>
        </p>
      </div>
    </header>
  );
};

export default Header;
