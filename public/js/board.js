let copy=document.getElementById('copy')
copy.addEventListener('click',()=>{
    let button=document.getElementById('p').innerText
    navigator.clipboard.writeText(button.split(":").pop())
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

// game concept

const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameEnd = false;
let winner=document.getElementById("winners")
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
  if (checkWinner()) {
    winner.textContent=`${currentPlayer} wins!`;
    gameEnd = true;
    return;
  }
  else{
    classadd()
  }
  if (checkDraw()) {
    winner.textContent='It\'s a draw!';
    gameEnd = true;
    return;
  }
  
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
},500)
}



function checkDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}
