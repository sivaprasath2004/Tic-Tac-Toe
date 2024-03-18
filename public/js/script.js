let button=document.getElementById('play_with_computer_button')
button.addEventListener('click',()=>{
    window.location.href="/computer"
})
let headings = ["Let's Joy", "Unlimited playing", "Play With Computer", "Play with Friends"];
let heading = document.getElementById('heading_changer');

async function display() {
    for (let ele = 0; ele < headings.length; ele++) {
        let text = headings[ele].split("");
        console.log(text)
        for (let i = 0; i <=text.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 se
           
    
        }
        let arr=headings[ele]
        for (let i = 0; i < arr.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 se
            console.log(arr.slice(0,arr.length-i))
        }
    }
}

display();
