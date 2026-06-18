let socket = io("https://tic-tac-toe-7bj5.onrender.com");

// ── Clock ──
setInterval(() => {
  const el = document.getElementById("time");
  if (!el) return;
  const t = new Date();
  let h = t.getHours(), m = t.getMinutes(), s = t.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h > 12 ? h - 12 : h === 0 ? 12 : h;
  el.value = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${ampm}`;
}, 1000);

// ── Panel helpers ──
const overlay       = document.getElementById("room-overlay");
const room_panel    = document.getElementById("Room_container");
const close_btn     = document.getElementById("close_button");
const tab_join      = document.getElementById("tab-join");
const tab_create    = document.getElementById("tab-create");
const Join_Room     = document.getElementById("Join_Room");
const Create_Room   = document.getElementById("Create_Room");

function openPanel() {
  room_panel.classList.add("viewRoomContainer");
  overlay.classList.add("active");
}
function closePanel() {
  room_panel.classList.remove("viewRoomContainer");
  overlay.classList.remove("active");
}
function showTab(tab) {
  if (tab === "join") {
    Join_Room.className   = "room_view";
    Create_Room.className = "room_hide";
    tab_join.classList.add("active");
    tab_create.classList.remove("active");
  } else {
    Create_Room.className = "room_view";
    Join_Room.className   = "room_hide";
    tab_create.classList.add("active");
    tab_join.classList.remove("active");
  }
}

// Open panel buttons
document.querySelectorAll(".friends, #friends-btn, #open-online-btn").forEach(el =>
  el?.addEventListener("click", openPanel)
);
close_btn?.addEventListener("click", closePanel);
overlay?.addEventListener("click", closePanel);
tab_join?.addEventListener("click",   () => showTab("join"));
tab_create?.addEventListener("click", () => showTab("create"));

// ── Mobile nav ──
const nav_container = document.getElementById("navigation_container");
const nav_btn       = document.getElementById("navigation_button");
const nav_links     = document.getElementById("view");

nav_container?.addEventListener("click", () => {
  const open = nav_links.classList.toggle("open");
  nav_btn?.classList.toggle("close", open);
});

// Close nav on link click
nav_links?.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    nav_links.classList.remove("open");
    nav_btn?.classList.remove("close");
  })
);

// ── FAQ accordion ──
document.querySelectorAll(".faq-q").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains("open");
    // close all
    document.querySelectorAll(".faq-a").forEach(a => a.classList.remove("open"));
    document.querySelectorAll(".faq-q").forEach(b => b.classList.remove("open"));
    if (!isOpen) {
      answer.classList.add("open");
      btn.classList.add("open");
    }
  });
});

// ── Create Room ──
document.getElementById("create_room_button")?.addEventListener("click", () => {
  const name = document.getElementById("create_room_input_name")?.value.trim();
  if (!name) return;
  socket.emit("join", { name: name + "1" }, ({ id, error }) => {
    if (error === "ok") window.location.href = `/board?id=${id}&name=${name + "1"}`;
  });
});

// ── Join Room ──
document.getElementById("join_room_button")?.addEventListener("click", () => {
  const name   = document.getElementById("join_room_input_name")?.value.trim();
  const roomId = document.getElementById("join_room_Room_id")?.value.trim();
  const errEl  = document.getElementById("errors");
  if (!name || !roomId) {
    if (errEl) errEl.textContent = "Please fill in all fields.";
    return;
  }
  socket.emit("joinRoom", { id: roomId, name: name + "2" }, ({ id, error }) => {
    if (error) { if (errEl) errEl.textContent = error; }
    else window.location.href = `/board?id=${id}&name=${name + "2"}`;
  });
});

// Allow Enter key in room fields
["join_room_input_name","join_room_Room_id"].forEach(id => {
  document.getElementById(id)?.addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("join_room_button")?.click();
  });
});
document.getElementById("create_room_input_name")?.addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("create_room_button")?.click();
});

// ── Computer mode ──
document.getElementById("play_with_computer_button")?.addEventListener("click", () => {
  window.location.href = "/computer";
});
