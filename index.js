const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server, { cors: { origin: "*" } });
const router = express.Router();
const PORT = process.env.PORT || 5000;
const {
  userAdded,
  userRoomcheck,
  matchStart,
  changeplayer,
  restart_game,
} = require("./controller/user");
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
router.get("/", (req, res) => {
  res.status(200).render("Home", {
    title: "Home",
  });
});
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "Home.html"));
// });
router.get("/board", (req, res) => {
  res.status(200).render("Board", {
    title: "board",
    id: req.query.id,
    name: req.query.name,
  });
});
router.get("/computer", (req, res) => {
  res.status(200).render("Board", {
    title: "Computer",
  });
});
io.on("connect", (socket) => {
  socket.on("join", ({ name }, callBack) => {
    const { user, error } = userAdded({ id: socket.id, name: name });
    if (!user) {
      callBack({ error: error });
      return;
    } else {
      callBack({ id: user.id, error: "ok" });
    }
  });
  socket.on("mainCoonection", (user) => {
    socket.join(user.id);
    socket.emit("message", { user: "admin", text: `${user.name} joined` });
    socket.broadcast.to(user.id).emit("message", {
      user: "admin",
      text: `${user.name} joined`,
      opp: user.name,
    });
  });
  socket.on("sendMes", (message, callBack) => {
    io.to(message.id).emit("message", message);
  });
  socket.on("joinRoom", ({ id, name }, callBack) => {
    const { user, error } = userRoomcheck({ id, name });
    if (error) {
      callBack({ error: error });
      return;
    } else {
      callBack({ id: user.id, error: error });
    }
  });
  socket.on("opponent", ({ id, name }, callBack) => {
    const { start, player1, palyer2, res, error } = matchStart({ id, name });
    if (error) {
      callBack(error);
    } else {
      io.to(id).emit("start", { start, player1, palyer2, res });
      callBack({ start, res, player1, palyer2 });
    }
  });
  socket.on("playerMove", ({ id, player, cell, currentsimbol }) => {
    const { currentPlayer, old_player } = changeplayer({ id, player });
    io.to(id).emit("player", {
      id,
      currentPlayer,
      cell,
      currentsimbol: currentsimbol === "X" ? "O" : "X",
      old_player,
    });
  });
  socket.on("reset", ({ id, Symbol, player, user }) => {
    const { start, res, currentPlayer } = restart_game({
      id,
      Symbol,
      player,
      user,
    });
    io.to(id).emit("reset_game", {
      start,
      res,
      currentPlayer,
      symbol: currentPlayer !== player ? (Symbol === "X" ? "O" : "X") : Symbol,
      user,
    });
  });
});
app.use(router);
server.listen(PORT, () => console.log(`this is running in ${PORT}`));
