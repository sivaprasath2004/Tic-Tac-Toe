setInterval(()=>{
let time_tag=document.getElementById('time')
let join_time=document.getElementById('jointime')
let time=new Date()
let hours=time.getHours()
let mins=time.getMinutes()
let secs=time.getSeconds()
let min=mins<10?'0'+mins:mins
let sec=secs<10?'0'+secs:secs
let hour=hours>12?hours-12:hours
let AMPM=hours>12?'PM':'AM'
time_tag.value=`${hour}:${min}:${sec} ${AMPM}`
join_time.value=`${hour}:${min}:${sec} ${AMPM}`
},1000)
let socket=io('http://localhost:5000')
let button=document.getElementById('create_room_input_button')
button.addEventListener('click',()=>{
let name=document.getElementById('create_room_input_name').value
if(name){
socket.emit('join',{name:name},({id,error})=>{
    if(error==="ok"){
        window.location.href = `/board?id=${id}&name=${name}`;
    }
})
}
})
let join_button=document.getElementById('join_room_input_button')
join_button.addEventListener('click',()=>{
    console.log("hello")
})
let join=document.getElementById('join_room')
let create=document.getElementById('create_room')
let createroom=document.getElementById('createroom')
let joinroom=document.getElementById('joinroom')
let create_room_butt=document.getElementById('create_room_butt')
let join_room=document.getElementById('join_room_butt')
join_room.addEventListener('click',()=>{
let container=document.getElementById('container')
let boxheading=document.getElementById('boxheading')
    create.style.display='none';
    join.style.display='flex';
    container.setAttribute('id','new_box')
    boxheading.setAttribute('id',"new_heading")
    joinroom.style.display="none"
    createroom.style.display="flex"
})
create_room_butt.addEventListener('click',()=>{
let new_box=document.getElementById('new_box')
let new_container=document.getElementById('new_heading')
    create.style.display='flex';
    join.style.display='none';
    new_box.setAttribute('id','container')
    new_container.setAttribute('id',"boxheading")
    joinroom.style.display="flex"
    createroom.style.display="none"
})
