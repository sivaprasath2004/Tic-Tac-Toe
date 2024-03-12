let socket=io()
let button=document.getElementById('create_room_input_button')
button.addEventListener('click',()=>{
let name=document.getElementById('create_room_input_name').value
let password=document.getElementById('create_room_input_password').value
socket.emit('join',{name:name,password:password},(err)=>{
    console.log(err)
})
})