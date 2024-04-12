document.addEventListener("DOMContentLoaded", () => {
  let socket = io("https://tic-tac-toe-7bj5.onrender.com");
  let button = document.getElementById("p").innerText;
  let user = document.getElementById("user").innerText;
  let message_Point = document.getElementById("message_Point");
  let RoomId = button.split(":").pop();
  socket.emit("mainCoonection", { id: RoomId, name: user }, () => {});
  socket.on("message", (msg) => {
    let chat_container = document.createElement("div");
    opp = msg.user;
    chat_container.setAttribute(
      "id",
      msg.user === "admin"
        ? "center_container"
        : msg.user === user
        ? "me_container"
        : "you_container"
    );
    let chats = document.createElement("p");
    chats.textContent = msg.text;
    chats.setAttribute(
      "id",
      msg.user === "admin" ? "center" : msg.user === user ? "me" : "you"
    );
    chat_container.appendChild(chats);
    message_Point.appendChild(chat_container);
  });
  let copy = document.getElementById("copy");
  copy.addEventListener("click", () => {
    let button = document.getElementById("p").innerText;
    navigator.clipboard.writeText(RoomId);
    let copy_text = document.getElementById("copy_text");
    let copy_icon = document.getElementById("copy_icon");
    copy_icon.setAttribute(
      "src",
      "https://cdn-icons-png.flaticon.com/128/5291/5291043.png"
    );
    copy_text.textContent = "copied";
    setTimeout(() => {
      copy_icon.setAttribute(
        "src",
        "https://cdn-icons-png.flaticon.com/128/1620/1620767.png"
      );
      copy_text.textContent = "copy";
    }, 1500);
  });

  let menu = document.getElementById("menu");
  let more = document.getElementById("more");
  let exit_game = document.getElementById("exit_game");
  let exit = document.getElementById("exit");
  menu.addEventListener("click", () => {
    exit_game.style.display = "none";
    if (more.style.display === "flex") {
      more.style.display = "none";
    } else {
      more.style.display = "flex";
    }
  });
  exit.addEventListener("click", () => {
    more.style.display = "none";
    if (exit_game.style.display === "flex") {
      exit_game.style.display = "none";
    } else {
      exit_game.style.display = "flex";
    }
  });
  exit_game.addEventListener("click", () => {
    window.location.href = "https://tic-tac-toe-7bj5.onrender.com/";
  });
  //message handle
  let message_icon = document.getElementById("message_icon");
  let messages = document.getElementById("send_message");
  let message_container = document.getElementById("message");
  const cells = document.querySelectorAll(".cell");
  message_icon.addEventListener("click", () => {
    if (message_container.style.display === "flex") {
      message_container.style.display = "none";
    } else {
      message_container.style.display = "flex";
    }
  });
  messages.addEventListener("click", () => {
    let text = document.getElementById("message_input").value;
    socket.emit(
      "sendMes",
      { id: button.split(":").pop(), user: user, text: text },
      () => {}
    );
    document.getElementById("message_input").value = "";
  });
  // game concept
  let gameEnd = false;
  let winner = document.createElement("p");
  let checker = false;
  socket.emit("opponent", { id: RoomId, name: user }, (msg) => {
    msg?.res === "ok" ? (checker = true) : null;
    if (checker) {
      null;
    } else {
      waitingoppenent();
    }
  });
  let currentPlayer = "X";
  let secondPlayer;
  socket.on("start", (start) => {
    start !== undefined ? (checker = true) : null;
    secondPlayer = start.player2;
    gameLogic(start.player1, start.player2);
    if (checker) {
      let opponent = document.querySelector(".oppenent");
      if (document.querySelector(".oppenent")) {
        document.body.removeChild(opponent);
      }
    }
  });
  function waitingoppenent() {
    winner.classList.add("oppenent");
    winner.textContent = "find your oppnent".toUpperCase();
    document.body.appendChild(winner);
  }

  socket.on("player", (moves) => {
    const cell = document.getElementById(`${moves.cell}`);
    cell.textContent = moves.currentsimbol;
    cell.classList.add(moves.currentsimbol === "X" ? "player-X" : "player-O");
    currentPlayer = moves.currentsimbol;
    let gameEnd = false;
    if (checkDraw()) {
      winner.classList.add("winners");
      Draw();
      gameEnd = true;
      return;
    }
    if (checkWinner()) {
      winner.classList.add("winners");
      player_winner(moves.old_player);
      gameEnd = true;
      return;
    }
    if (!gameEnd) {
      gameLogic(moves.currentPlayer, moves.old_player);
    }
  });
  let winner_player;
  function player_winner(wining_player) {
    winner_player = winner_player;
    winner.textContent = "";
    winner.classList.remove("oppenent");
    let p_tag = document.createElement("p");
    p_tag.textContent = `${wining_player === user ? "You" : "Opponent"} win!`;
    p_tag.classList.add("slogan");
    let reset_button = document.createElement("button");
    reset_button.classList.add("reset_game");
    reset_button.textContent = "Rematch";
    winner.appendChild(reset_button);
    winner.appendChild(p_tag);
    document.body.appendChild(winner);
    reset();
  }
  function resetGame() {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.remove("animation", "player-X", "player-O");
      cell.textContent = "";
    });
    if (winner.parentNode) {
      winner.parentNode.removeChild(winner);
    }
  }
  const reset = () => {
    let reset_game = document.querySelector(".reset_game");
    reset_game.addEventListener("click", () => {
      socket.emit("reset", {
        id: RoomId,
        Symbol: currentPlayer,
        player: move_player,
        user,
      });
    });
  };
  socket.on("reset_game", (msg) => {
    if (msg.res === "ok") {
      resetGame(msg.currentPlayer, msg.symbol);
    } else {
      if (user === msg.user) {
        let parent_tag = document.querySelector(".winners");
        let p_tag = document.querySelector(".slogan");
        p_tag.textContent = msg.start;
        let reset_button = document.querySelector(".reset_game");
        parent_tag.removeChild(reset_button);
      } else {
        null;
      }
    }
  });
  function Draw() {
    winner_player = "Draw";
    winner.textContent = "";
    winner.classList.remove("oppenent");
    let p_tag = document.createElement("p");
    p_tag.textContent = "match is Draw";
    p_tag.classList.add("slogan");
    let reset_button = document.createElement("button");
    reset_button.classList.add("reset_game");
    reset_button.textContent = "Rematch";
    winner.appendChild(reset_button);
    winner.appendChild(p_tag);
    document.body.appendChild(winner);
    reset();
  }
  function checkDraw() {
    console.log("Checking");
    return [...cells].every((cell) => cell.textContent !== "");
  }
  function checkWinner() {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winningCombos.some((combo) => {
      const [a, b, c] = combo;
      return (
        cells[a].textContent === currentPlayer &&
        cells[b].textContent === currentPlayer &&
        cells[c].textContent === currentPlayer
      );
    });
  }
  let move_player;
  let clickHandler;
  function oppenent_palyer() {
    let profiles = document.getElementById("profiles");
    let opponent_player = document.createElement("div");
    opponent_player.classList.add("opponent_profile");
    let name = document.createElement("p");
    name.textContent = "O";
    opponent_player.appendChild(name);
    profiles.appendChild(opponent_player);
  }
  function gameLogic(player, opponent) {
    move_player = player;
    let user = document.getElementById("user").innerText;
    let cells = document.querySelectorAll(".cell");

    cells.forEach((cell, index) => {
      if (player === user) {
        if (document.querySelector(".opponent_profile")) {
          null;
        } else {
          oppenent_palyer();
        }
        let player_turn = document.getElementById("player_turn");
        player_turn.textContent = "Your turn";
        player_turn.style.display = "flex";
        player_turn.style.color = "#01FF70";
        cell.addEventListener("click", clickHandler);
      } else {
        if (document.querySelector(".opponent_profile")) {
          null;
        } else {
          oppenent_palyer(opponent);
        }
        let player_turn = document.getElementById("player_turn");
        player_turn.textContent = "Opponent turn";
        player_turn.style.display = "flex";
        player_turn.style.color = "#FF4136";
        cell.removeEventListener("click", clickHandler);
      }
    });
  }

  clickHandler = function (event) {
    let index = Array.from(event.target.parentNode.children).indexOf(
      event.target
    );
    socket.emit(
      "playerMove",
      {
        id: RoomId,
        player: move_player,
        cell: index,
        currentsimbol: currentPlayer,
      },
      () => {}
    );
    this.classList.add("animation");
    this.textContent = currentPlayer;
    setTimeout(() => {
      this.classList.remove("animation");
      if (gameEnd || this.textContent !== "") return;
      this.textContent = currentPlayer;
      const classadd = () => {
        this.classList.remove("animation");
        if (currentPlayer === "X") {
          this.classList.add("player-X");
        } else {
          this.classList.add("player-O");
        }
      };
      classadd();
    }, 500);
  };
});
