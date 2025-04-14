// Check if a board has a winner and return the player token
export const checkWinner = (board: number[]): number | null => {
  for (let i = 0; i < 3; i++) {
    // Check rows
    const row = i * 3;
    if (board[row] && board[row] === board[row + 1] && board[row + 1] === board[row + 2]) {
      return board[row];
    }
    // Check columns
    if (board[i] && board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
      return board[i];
    }
  }
  // Check leading diagonal
  if (board[0] && board[0] === board[4] && board[4] === board[8]) {
    return board[0];
  }
  // Check counter diagonal
  if (board[2] && board[2] === board[4] && board[4] === board[6]) {
    return board[2];
  }
  return null;
};
