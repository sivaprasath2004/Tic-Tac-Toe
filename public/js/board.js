document.addEventListener('DOMContentLoaded', () => {
  let socket = io('http://localhost:5000');
  let player=[]
  let button=document.getElementById('p').innerText
  let user=document.getElementById('user').innerText
  let message_Point=document.getElementById('message_Point')
  let RoomId=button.split(":").pop()
  socket.emit('mainCoonection',({id:RoomId,name:user}),()=>{
    console.log("clicked")
  })
socket.on('message', msg => {
    msg?.opp?player.push({id:RoomId,name:user,opp:msg.opp}):null
    console.log(player)
    let chat_container=document.createElement('div')
    chat_container.setAttribute('id',msg.user==="admin"?"center_container":msg.user===user?"me_container":"you_container")
      let chats=document.createElement('p')
      chats.textContent=msg.text
      chats.setAttribute('id',msg.user==="admin"?"center":msg.user===user?"me":"you")
      chat_container.appendChild(chats)
      message_Point.appendChild(chat_container)

});
let copy=document.getElementById('copy')
copy.addEventListener('click',()=>{
    let button=document.getElementById('p').innerText
    navigator.clipboard.writeText(RoomId)
    let copy_text=document.getElementById('copy_text')
    let copy_icon=document.getElementById('copy_icon')
    copy_icon.setAttribute('src',"https://cdn-icons-png.flaticon.com/128/5291/5291043.png")
    copy_text.textContent="copied"
    setTimeout(()=>{
    copy_icon.setAttribute('src',"https://cdn-icons-png.flaticon.com/128/1620/1620767.png");
    copy_text.textContent="copy";    
},1500)
})

let menu=document.getElementById('menu')
let more=document.getElementById('more')
let exit_game=document.getElementById('exit_game')
let exit=document.getElementById('exit')
menu.addEventListener('click',()=>{
    exit_game.style.display='none'
    if(more.style.display==="flex"){
        more.style.display='none'
    }
    else{
        more.style.display="flex" 
    }
})
exit.addEventListener('click',()=>{
    more.style.display='none'
    if(exit_game.style.display==="flex"){
        exit_game.style.display='none'
    }
    else{
        exit_game.style.display="flex" 
    }
})
exit_game.addEventListener('click',()=>{
    window.location.href='http://localhost:5000/'
})
//message handle
let message_icon=document.getElementById('message_icon')
let messages=document.getElementById('send_message')
let message_container=document.getElementById('message')
message_icon.addEventListener('click',()=>{
  if(message_container.style.display==="flex"){
    message_container.style.display="none"
  }else{
  message_container.style.display="flex"
  }
})
messages.addEventListener('click',()=>{
  console.log("clicked")
  let text=document.getElementById('message_input').value
  socket.emit('sendMes',({id:button.split(':').pop(),user:user,text:text}),()=>{
  })
  document.getElementById('message_input').value=""
})
// game concept
let findoppnent=player.find(item=>item.id===RoomId)
const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameEnd = false;
let winner=document.createElement('p')
if(findoppnent?.opp!==undefined){
  winner.classList.remove('winners')
cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

async function handleClick() {
    this.classList.add("animation")
    setTimeout(()=>{
    this.classList.remove("animation")
  if (gameEnd || this.textContent !== '') return;
  this.textContent = currentPlayer;
  const classadd=()=>{
    this.classList.remove("animation")
    if(currentPlayer==="X"){
        console.log("player X")
      this.classList.add("player-X")
      }
      else{
        console.log("player-0")
      this.classList.add("player-O")
      }
  }
  function checkWinner() {
    classadd()
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    
    return winningCombos.some(combo => {
      const [a, b, c] = combo;
      return cells[a].textContent === currentPlayer &&
             cells[b].textContent === currentPlayer &&
             cells[c].textContent === currentPlayer;
    });
  }
  const win=(win)=>{
    winner.classList.add("winners")
    if(win!=="draw"){
    winner.textContent=`${user} wins!`;
    }else{
      winner.textContent="This match is Draw"
    }
  }
  if (checkWinner()) {
    win("user_win")
    gameEnd = true;
    return;
  }
  else{
    classadd()
  }
  if (checkDraw()) {
    win("draw")
    gameEnd = true;
    return;
  }
  
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
},500)
}



function checkDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}
}
else{
  winner.classList.add("winners")
  winner.textContent="find your oppnent"
  document.body.appendChild(winner)
}
})
