let button=document.getElementById('play_with_computer_button')
button.addEventListener('click',()=>{
    window.location.href="/computer"
})
let headings = ["Let's Rock & Joy", "Unlimited playing", "Play With Computer", "Play with Friends"];
let heading = document.getElementById('heading_changer');

let repeat=true;
async function display() {
    heading.style.color="white"
    heading.style.fontSize="2rem"
    for (let ele = 0; ele < headings.length; ele++) {
        let text = headings[ele]
        console.log(text)
        console.log(text.length)
        for (let i = 0; i <text.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500)); 
           console.log(text.slice(0,i))
           heading.textContent=text.slice(0,i)
    
        }
        let arr=headings[ele]
        for (let i = 0; i < arr.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 300)); 
           heading.textContent=arr.slice(0,arr.length-i)
        }
        heading.textContent=" "
    }
    repeat=true
}
setInterval(()=>{
 if(repeat){
    repeat=false
  display()
 }
 else{
    null
 }
},500)
