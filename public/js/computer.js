document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const cells = document.querySelectorAll(".cell");
  let currentPlayer = "X";
  let gameActive = true;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  const checkWinner = () => {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        cells[a].textContent &&
        cells[a].textContent === cells[b].textContent &&
        cells[a].textContent === cells[c].textContent
      ) {
        gameActive = false;
        return cells[a].textContent;
      }
    }
    return null;
  };

  const checkTie = () => {
    return Array.from(cells).every((cell) => cell.textContent !== "");
  };
  const winner_checking = (item) => {
    const winner = checkWinner();
    if (winner) {
      let wining_slogan;
      if (item === "user") {
        wining_slogan = "You won  ..!";
      } else {
        wining_slogan = "You Lost ..!";
      }
      player_winner(wining_slogan);
      console.log("winner");
      gameActive = false;
    } else {
      if (checkTie()) {
        player_winner("Drae the Match");
        gameActive = false;
      } else {
        if (item === "user") {
          setTimeout(computerMove, 500);
        }
      }
    }
  };
  function player_winner(wining_player) {
    let winner = document.createElement("p");
    winner.classList.add("winners");
    let p_tag = document.createElement("p");
    p_tag.textContent = wining_player;
    p_tag.classList.add("slogan");
    let reset_button = document.createElement("button");
    reset_button.classList.add("reset_game");
    reset_button.textContent = "Rematch";
    winner.appendChild(reset_button);
    winner.appendChild(p_tag);
    document.body.appendChild(winner);
    reset_button.addEventListener("click", () => resetGame());
  }
  function resetGame() {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.remove("animation", "player-X", "player-O");
      cell.textContent = "";
    });
    let winner = document.querySelector(".winners");
    winner.parentNode.removeChild(winner);
    gameActive = true;
  }
  const computerMove = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    const emptyCells = Array.from(cells).filter(
      (cell) => cell.textContent === ""
    );
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];
    cell.classList.add("animation");
    cell.textContent = currentPlayer;
    setTimeout(() => {
      cell.classList.remove("animation");
      cell.textContent = currentPlayer;
      const classadd = () => {
        cell.classList.remove("animation");
        if (currentPlayer === "X") {
          cell.classList.add("player-X");
        } else {
          cell.classList.add("player-O");
        }
      };
      classadd();
      winner_checking("computer");
    }, 500);
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (gameActive && !cell.textContent) {
        cell.classList.add("animation");
        cell.textContent = currentPlayer;
        setTimeout(() => {
          cell.classList.remove("animation");
          cell.textContent = currentPlayer;
          const classadd = () => {
            cell.classList.remove("animation");
            if (currentPlayer === "X") {
              cell.classList.add("player-X");
            } else {
              cell.classList.add("player-O");
            }
            setTimeout(winner_checking("user"), 500);
          };
          classadd();
        }, 500);
      }
    });
  });

  let exit = document.getElementById("exit");
  exit.addEventListener("click", () => {
    if (exit_game.style.display === "flex") {
      exit_game.style.display = "none";
    } else {
      exit_game.style.display = "flex";
    }
  });
});
