let time_tag=document.getElementById('time')
setInterval(()=>{
let time=new Date()
let hours=time.getHours()
let mins=time.getMinutes()
let secs=time.getSeconds()
let min=mins<10?'0'+mins:mins
let sec=secs<10?'0'+secs:secs
let hour=hours>12?hours-12:hours
let AMPM=hours>12?'PM':'AM'
time_tag.value=`${hour}:${min}:${sec} ${AMPM}`
},1000)
let socket=io()
let button=document.getElementById('create_room_input_button')
button.addEventListener('click',()=>{
if(button.value!==undefined && button.value?.lenght>0){
    let name=document.getElementById('create_room_input_name').value
socket.emit('join',{name:name},(err)=>{
    console.log(err)
   
})
}
})
let join=document.getElementById('join_room')
let create=document.getElementById('create_room')
let container=document.getElementById('container')
let new=document.getElementById('new_heading')
let join_room=document.getElementById('join_room_butt')
join_room.addEventListener('click',()=>{
    create.style.display='none';
    join.style.display='block';
    join.style.display='flex';
    join.style.justifyContent="center";
    join.style.alignItems="center";
    join.style.gap='2rem';
    container.setAttribute('id','new_box')
})
