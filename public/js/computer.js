document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  let currentPlayer = "X";
  let gameActive    = true;

  const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  const checkWinner = () => {
    for (const [a,b,c] of WINS) {
      if (cells[a].dataset.val &&
          cells[a].dataset.val === cells[b].dataset.val &&
          cells[a].dataset.val === cells[c].dataset.val)
        return cells[a].dataset.val;
    }
    return null;
  };

  const checkTie = () => [...cells].every(c => c.dataset.val);

  function mark(cell, player) {
    cell.dataset.val = player;
    cell.classList.add("animation");
    setTimeout(() => {
      cell.classList.remove("animation");
      cell.classList.add(player === "X" ? "player-X" : "player-O");
    }, 350);
  }

  function showResult(msg, icon) {
    gameActive = false;
    const overlay = document.createElement("div");
    overlay.classList.add("winners");

    const ic = Object.assign(document.createElement("div"), { className: "result-icon", textContent: icon });
    const tx = Object.assign(document.createElement("p"),   { className: "slogan",      textContent: msg  });
    const bt = Object.assign(document.createElement("button"), { className: "reset_game", textContent: "Play Again" });

    bt.addEventListener("click", () => {
      cells.forEach(c => {
        c.classList.remove("animation","player-X","player-O");
        delete c.dataset.val;
      });
      overlay.remove();
      currentPlayer = "X";
      gameActive = true;
    });

    overlay.append(ic, tx, bt);
    document.body.appendChild(overlay);
  }

  // ── AI ──
  function getBestMove() {
    const empty = [...cells].filter(c => !c.dataset.val);

    // 1. Win
    for (const [a,b,c] of WINS) {
      const arr = [cells[a], cells[b], cells[c]];
      if (arr.filter(x => x.dataset.val === "O").length === 2 &&
          arr.filter(x => !x.dataset.val).length === 1)
        return arr.find(x => !x.dataset.val);
    }
    // 2. Block
    for (const [a,b,c] of WINS) {
      const arr = [cells[a], cells[b], cells[c]];
      if (arr.filter(x => x.dataset.val === "X").length === 2 &&
          arr.filter(x => !x.dataset.val).length === 1)
        return arr.find(x => !x.dataset.val);
    }
    // 3. Center
    if (!cells[4].dataset.val) return cells[4];
    // 4. Corner
    const corner = [0,2,6,8].find(i => !cells[i].dataset.val);
    if (corner !== undefined) return cells[corner];
    // 5. Random
    return empty[Math.floor(Math.random() * empty.length)];
  }

  function computerTurn() {
    if (!gameActive) return;
    const target = getBestMove();
    if (!target) return;
    mark(target, "O");
    setTimeout(() => {
      const w = checkWinner();
      if (w)          { showResult("Computer wins!", "😤"); return; }
      if (checkTie()) { showResult("It's a draw!",  "🤝"); return; }
      currentPlayer = "X";
    }, 360);
  }

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      if (!gameActive || cell.dataset.val) return;
      mark(cell, "X");
      setTimeout(() => {
        const w = checkWinner();
        if (w)          { showResult("You won! 🎉",  "🎉"); return; }
        if (checkTie()) { showResult("It's a draw!", "🤝"); return; }
        currentPlayer = "O";
        computerTurn();
      }, 360);
    });
  });

  // Exit
  const exitBtn  = document.getElementById("exit");
  const exitGame = document.getElementById("exit_game");
  exitBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (exitGame) exitGame.style.display = exitGame.style.display === "flex" ? "none" : "flex";
  });
  exitGame?.addEventListener("click", () => { window.location.href = "/"; });
  document.addEventListener("click", () => { if (exitGame) exitGame.style.display = "none"; });
});
