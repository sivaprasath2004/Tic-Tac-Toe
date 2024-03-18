document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    let currentPlayer = 'X';
    let gameActive = true;
  
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];
  
    const checkWinner = () => {
      for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
          cells[a].classList.add('winner');
          cells[b].classList.add('winner');
          cells[c].classList.add('winner');
          gameActive = false;
          return cells[a].textContent;
        }
      }
      return null;
    };
  
    const checkTie = () => {
      return Array.from(cells).every(cell => cell.textContent !== '');
    };
  
    const computerMove = () => {
      const emptyCells = Array.from(cells).filter(cell => cell.textContent === '');
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const cell = emptyCells[randomIndex];
      cell.classList.add("animation")
      cell.textContent=currentPlayer
      setTimeout(()=>{
      currentPlayer = 'O';
      cell.classList.remove("animation")
      cell.textContent = currentPlayer;
    const classadd=()=>{
      cell.classList.remove("animation")
      if(currentPlayer==="X"){
        cell.classList.add("player-X")
        }
        else{
        cell.classList.add("player-O")
        }
    }
    classadd()
   
  },500)
      const winner = checkWinner();
      if (!winner) {
        if (checkTie()) {
          alert("It's a tie!");
          gameActive = false;
        }
      }
    };
  
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        if (gameActive && !cell.textContent) {
            cell.classList.add("animation")
      cell.textContent=currentPlayer
      setTimeout(()=>{
      currentPlayer = 'X';
      cell.classList.remove("animation")
      cell.textContent = currentPlayer;
    const classadd=()=>{
      cell.classList.remove("animation")
      if(currentPlayer==="X"){
        cell.classList.add("player-X")
        }
        else{
        cell.classList.add("player-O")
        }
    }
    classadd()
   
  },500)
          const winner = checkWinner();
          if (winner) {
            console.log("winner")
            alert(`${winner} wins!`);
            gameActive = false;
          } else {
            if (checkTie()) {
              alert("It's a tie!");
              gameActive = false;
            } else {
              setTimeout(computerMove, 500); 
            }
          }
        }
      });
    });
  
let exit=document.getElementById('exit')
exit.addEventListener('click',()=>{
    if(exit_game.style.display==="flex"){
        exit_game.style.display='none'
    }
    else{
        exit_game.style.display="flex" 
    }
})
});
