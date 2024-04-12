let socket = io("https://tic-tac-toe-7bj5.onrender.com");
setInterval(() => {
  let time_tag = document.getElementById("time");
  let time = new Date();
  let hours = time.getHours();
  let mins = time.getMinutes();
  let secs = time.getSeconds();
  let min = mins < 10 ? "0" + mins : mins;
  let sec = secs < 10 ? "0" + secs : secs;
  let hour = hours > 12 ? hours - 12 : hours;
  let AMPM = hours > 12 ? "PM" : "AM";
  time_tag.value = `${hour < 10 ? "0" + hour : hour}:${min}:${sec} ${AMPM}`;
}, 1000);
let navigation = document.getElementById("navigation_container");
let navigate = document.getElementById("navigation_button");
let nav = document.getElementById("view");
let room_button = document.querySelector(".friends");
let room_container = document.querySelector(".Room_container");
let close_button = document.getElementById("close_button");
let roomimage_toggle = document.getElementById("roomimage_toggle");
let Join_Room = document.getElementById("Join_Room");
let Create_Room = document.getElementById("Create_Room");
navigation.addEventListener("click", handle_navigation);
function handle_navigation() {
  if (nav.classList.contains("view")) {
    nav.classList.remove("view");
    nav.style.height = window.screen.height + "px";
    navigate.classList.remove("close");
    room_button.addEventListener("click", handle_room_container);
  } else {
    nav.classList.add("view");
    nav.style.height = window.screen.height + "px";
    navigate.classList.add("close");
    room_button.removeEventListener("click", handle_room_container);
  }
}
function handle_room_container() {
  room_container.classList.add("viewRoomContainer");
  navigation.removeEventListener("click", handle_navigation);
}
room_button.addEventListener("click", handle_room_container);
close_button.addEventListener("click", () => {
  room_container.classList.remove("viewRoomContainer");
  navigation.addEventListener("click", handle_navigation);
});
function handle_click() {
  if (roomimage_toggle.classList.contains("create")) {
    roomimage_toggle.classList.remove("create");
    Create_Room.classList.remove("room_view");
    Join_Room.classList.remove("room_hide");
    Join_Room.classList.add("room_view");
    Create_Room.classList.add("room_hide");
    roomimage_toggle.setAttribute(
      "src",
      "https://cdn-icons-png.flaticon.com/128/9055/9055030.png"
    );
  } else {
    roomimage_toggle.classList.add("create");
    Create_Room.classList.add("room_view");
    Join_Room.classList.add("room_hide");
    Join_Room.classList.remove("room_view");
    Create_Room.classList.remove("room_hide");
    roomimage_toggle.setAttribute(
      "src",
      "https://cdn-icons-png.flaticon.com/128/3394/3394785.png"
    );
  }
}
roomimage_toggle.addEventListener("click", handle_click);
let button = document.getElementById("create_room_button");
button.addEventListener("click", () => {
  let name = document.getElementById("create_room_input_name").value + "1";
  if (name.length > 1) {
    socket.emit("join", { name: name }, ({ id, error }) => {
      if (error === "ok") {
        window.location.href = `/board?id=${id}&name=${name}`;
      }
    });
  }
});
let join_button = document.getElementById("join_room_button");
join_button.addEventListener("click", () => {
  let join_room_input_name =
    document.getElementById("join_room_input_name").value + "2";
  let join_room_Room_id = document.getElementById("join_room_Room_id").value;
  let error_display = document.getElementById("errors");
  if (join_room_Room_id && join_room_input_name.length > 1) {
    socket.emit(
      "joinRoom",
      { id: join_room_Room_id, name: join_room_input_name },
      ({ id, error }) => {
        if (error) {
          error_display.textContent = error;
        } else {
          window.location.href = `/board?id=${id}&name=${join_room_input_name}`;
        }
      }
    );
  } else {
    null;
  }
});
let computer_play = document.getElementById("play_with_computer_button");
computer_play.addEventListener("click", () => {
  window.location.href = "/computer";
});
