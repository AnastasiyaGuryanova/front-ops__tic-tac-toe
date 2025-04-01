document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const status = document.getElementById("status");
  const resetBtn = document.getElementById("reset");
  let currentPlayer = "X";
  let gameBoard = ["", "", "", "", "", "", "", "", ""];
  let gameActive = true;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }

  resetBtn.addEventListener("click", resetGame);

  function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (gameBoard[index] === "" && gameActive) {
      gameBoard[index] = currentPlayer;
      e.target.textContent = currentPlayer;
      if (checkWin()) {
        status.textContent = `Победил ${currentPlayer}!`;
        gameActive = false;
      } else if (gameBoard.every((cell) => cell !== "")) {
        status.textContent = "Ничья!";
        gameActive = false;
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `Ход: ${currentPlayer}`;
      }
    }
  }

  function checkWin() {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winConditions.some((condition) =>
      condition.every((index) => gameBoard[index] === currentPlayer)
    );
  }

  function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    status.textContent = "Ход: X";
    document
      .querySelectorAll(".cell")
      .forEach((cell) => (cell.textContent = ""));
  }
});
