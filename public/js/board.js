document.addEventListener("DOMContentLoaded", () => {
  const socket    = io("https://tic-tac-toe-7bj5.onrender.com");
  const roomIdRaw = (document.getElementById("p")?.innerText || "").replace("ID:", "").trim();
  const user      = (document.getElementById("user")?.innerText || "").trim();
  const msgPoint  = document.getElementById("message_Point");
  const RoomId    = roomIdRaw;

  let gameActive    = false;
  let currentPlayer = "X";
  let move_player;
  let clickHandler;
  const cells = document.querySelectorAll(".cell");

  socket.emit("mainCoonection", { id: RoomId, name: user });

  // ════════════════════════════════════════
  //  CHAT
  // ════════════════════════════════════════
  const chatPanel  = document.getElementById("message");
  const chatIcon   = document.getElementById("message_icon");
  const chatBadge  = document.getElementById("chat_badge");
  const chatClose  = document.getElementById("chat_close");
  const msgInput   = document.getElementById("message_input");
  const sendBtn    = document.getElementById("send_message");

  function openChat() {
    chatPanel?.classList.add("chat-open");
    if (chatBadge) chatBadge.style.display = "none";
    msgInput?.focus();
  }
  function closeChat() {
    chatPanel?.classList.remove("chat-open");
  }

  chatIcon?.addEventListener("click", () => {
    chatPanel?.classList.contains("chat-open") ? closeChat() : openChat();
  });
  chatClose?.addEventListener("click", closeChat);

  // Receive message
  socket.on("message", (msg) => {
    if (!msgPoint) return;

    const row = document.createElement("div");

    if (msg.user === "admin") {
      row.className   = "msg-center";
      row.textContent = msg.text;
    } else {
      const isMe = msg.user === user;
      row.className   = isMe ? "msg-me" : "msg-you";
      const bub       = document.createElement("span");
      bub.className   = isMe ? "bubble-me" : "bubble-you";
      bub.textContent = msg.text;
      row.appendChild(bub);
    }

    msgPoint.appendChild(row);
    msgPoint.scrollTop = msgPoint.scrollHeight;

    // Show badge if chat is closed
    if (!chatPanel?.classList.contains("chat-open") && chatBadge) {
      chatBadge.style.display = "block";
    }
  });

  // Send message
  const doSend = () => {
    const text = msgInput?.value.trim();
    if (!text) return;
    socket.emit("sendMes", { id: RoomId, user, text });
    msgInput.value = "";
    msgInput.focus();
  };
  sendBtn?.addEventListener("click", doSend);
  msgInput?.addEventListener("keydown", e => { if (e.key === "Enter") doSend(); });

  // ════════════════════════════════════════
  //  HEADER DROPDOWNS
  // ════════════════════════════════════════
  const menuBtn  = document.getElementById("menu");
  const exitBtn  = document.getElementById("exit");
  const moreEl   = document.getElementById("more");
  const exitGame = document.getElementById("exit_game");

  function hideDropdowns() {
    if (moreEl)   moreEl.style.display   = "none";
    if (exitGame) exitGame.style.display  = "none";
  }

  menuBtn?.addEventListener("click", e => {
    e.stopPropagation();
    if (exitGame) exitGame.style.display = "none";
    if (moreEl) moreEl.style.display = moreEl.style.display === "flex" ? "none" : "flex";
  });
  exitBtn?.addEventListener("click", e => {
    e.stopPropagation();
    if (moreEl) moreEl.style.display = "none";
    if (exitGame) exitGame.style.display = exitGame.style.display === "flex" ? "none" : "flex";
  });
  exitGame?.addEventListener("click", () => { window.location.href = "/"; });
  document.addEventListener("click", hideDropdowns);

  // Copy room ID
  document.getElementById("copy")?.addEventListener("click", e => {
    e.stopPropagation();
    navigator.clipboard.writeText(RoomId);
    const txt  = document.getElementById("copy_text");
    const icon = document.getElementById("copy_icon");
    if (icon) icon.src = "https://cdn-icons-png.flaticon.com/128/5291/5291043.png";
    if (txt)  txt.textContent = "Copied!";
    setTimeout(() => {
      if (icon) icon.src = "https://cdn-icons-png.flaticon.com/128/1620/1620767.png";
      if (txt)  txt.textContent = "Copy Room ID";
    }, 1500);
  });

  // ════════════════════════════════════════
  //  BOARD LOCK / UNLOCK
  // ════════════════════════════════════════

  // Lock every cell — no cursor, no pointer events
  function lockBoard() {
    gameActive = false;
    cells.forEach(cell => {
      cell.removeEventListener("click", clickHandler);
      cell.style.cursor        = "default";
      cell.style.pointerEvents = "none";
    });
    const ind = document.getElementById("player_turn");
    if (ind) { ind.textContent = "Game Over"; ind.className = ""; }
  }

  // Enable only empty cells for the current player
  function enableBoard() {
    gameActive = true;
    cells.forEach(cell => {
      cell.removeEventListener("click", clickHandler);
      cell.style.cursor        = "";
      cell.style.pointerEvents = "";
      if (!cell.classList.contains("player-X") && !cell.classList.contains("player-O")) {
        cell.addEventListener("click", clickHandler);
        cell.style.cursor = "pointer";
      } else {
        cell.style.cursor = "default";
      }
    });
  }

  // Disable all cells — opponent's turn
  function disableBoard() {
    cells.forEach(cell => {
      cell.removeEventListener("click", clickHandler);
      cell.style.cursor        = "not-allowed";
      cell.style.pointerEvents = "none";
    });
  }

  // ════════════════════════════════════════
  //  GAME EVENTS
  // ════════════════════════════════════════
  socket.emit("opponent", { id: RoomId, name: user }, (msg) => {
    if (!msg || msg.res !== "ok") showWaiting();
  });

  function showWaiting() {
    const el   = document.createElement("div");
    el.classList.add("oppenent");
    el.id      = "waiting-el";
    const spin = document.createElement("div");
    spin.classList.add("spinner");
    el.appendChild(spin);
    el.appendChild(Object.assign(document.createElement("span"), { textContent: "Waiting for opponent…" }));
    document.body.appendChild(el);
  }

  socket.on("start", (start) => {
    document.getElementById("waiting-el")?.remove();
    document.querySelector(".oppenent")?.remove();
    gameLogic(start.player1, start.player2);
  });

  socket.on("player", (moves) => {
    const cell = document.getElementById(`${moves.cell}`);
    if (!cell) return;

    // Mark the cell
    cell.textContent = moves.currentsimbol;
    cell.classList.add(moves.currentsimbol === "X" ? "player-X" : "player-O");
    cell.style.cursor = "default";
    cell.style.pointerEvents = "none";
    cell.removeEventListener("click", clickHandler);

    currentPlayer = moves.currentsimbol;

    // Check result BEFORE passing to next turn
    if (checkWinner()) { lockBoard(); showResult("win", moves.old_player); return; }
    if (checkDraw())   { lockBoard(); showResult("draw");                  return; }

    gameLogic(moves.currentPlayer, moves.old_player);
  });

  socket.on("reset_game", (msg) => {
    if (msg.res === "ok") {
      resetBoard();
    } else if (user === msg.user) {
      const slogan = document.querySelector(".slogan");
      const btn    = document.querySelector(".reset_game");
      if (slogan) slogan.textContent = "Waiting for opponent to accept…";
      btn?.remove();
    }
  });

  function resetBoard() {
    cells.forEach(c => {
      c.classList.remove("animation", "player-X", "player-O");
      c.textContent        = "";
      c.style.cursor       = "";
      c.style.pointerEvents = "";
    });
    document.querySelector(".winners")?.remove();
    gameActive = false;
  }

  // ════════════════════════════════════════
  //  RESULT OVERLAY
  // ════════════════════════════════════════
  function showResult(type, winning_player) {
    document.querySelector(".winners")?.remove();

    const overlay = document.createElement("div");
    overlay.classList.add("winners");

    const icon = Object.assign(document.createElement("div"), {
      className: "result-icon",
      textContent: type === "draw" ? "🤝"
        : winning_player === user ? "🎉" : "😤"
    });
    const msg = Object.assign(document.createElement("p"), {
      className: "slogan",
      textContent: type === "draw" ? "It's a draw!"
        : winning_player === user ? "You won!" : "Opponent wins!"
    });
    const btn = Object.assign(document.createElement("button"), {
      className: "reset_game",
      textContent: "Rematch"
    });
    btn.addEventListener("click", () =>
      socket.emit("reset", { id: RoomId, Symbol: currentPlayer, player: move_player, user })
    );

    overlay.append(icon, msg, btn);
    document.body.appendChild(overlay);
  }

  // ════════════════════════════════════════
  //  HELPERS
  // ════════════════════════════════════════
  function checkWinner() {
    const W = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return W.some(([a,b,c]) =>
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    );
  }
  function checkDraw() { return [...cells].every(c => c.textContent !== ""); }

  function setTurn(isMe) {
    const ind = document.getElementById("player_turn");
    if (!ind) return;
    ind.textContent = isMe ? "Your Turn" : "Opponent's Turn";
    ind.className   = isMe ? "your-turn" : "opp-turn";
  }

  function addOpponent() {
    if (document.querySelector(".opponent_profile")) return;
    const profiles = document.getElementById("profiles");
    const div = Object.assign(document.createElement("div"), { className: "opponent_profile" });
    div.appendChild(Object.assign(document.createElement("p"), { textContent: "O" }));
    profiles?.appendChild(div);
  }

  function gameLogic(player, _opp) {
    move_player = player;
    const me = (document.getElementById("user")?.innerText || "").trim();
    addOpponent();

    if (player === me) {
      setTurn(true);
      enableBoard();
    } else {
      setTurn(false);
      disableBoard();
    }
  }

  // Click handler — defined after lockBoard/disableBoard so they can reference it
  clickHandler = function () {
    if (!gameActive) return;
    if (this.classList.contains("player-X") || this.classList.contains("player-O")) return;

    // Lock immediately to prevent double-click
    disableBoard();

    const index = Array.from(this.parentNode.children).indexOf(this);
    socket.emit("playerMove", {
      id: RoomId,
      player: move_player,
      cell: index,
      currentsimbol: currentPlayer
    });

    this.classList.add("animation");
    setTimeout(() => {
      this.classList.remove("animation");
      this.classList.add(currentPlayer === "X" ? "player-X" : "player-O");
      this.style.cursor = "default";
    }, 350);
  };
});
