const express=require('express')
const app=express()
const path=require('path')
const http=require('http')
const server=http.createServer(app)
const socketio=require('socket.io')
const io=socketio(server,{cors:{origin:'*'}})
const router=express.Router()
const {userAdded,userRoomcheck}=require('./controller/user')
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','pug')
router.get('/',(req,res)=>{
    res.status(200).render('index',{
        title:"Home"
    })
})
router.get('/about',(req,res)=>{
    res.status(200).render('About',{
        title:'About'
    })
})
router.get('/friends',(req,res)=>{
    res.status(200).render('Friends',{
        title:'friends'
    })
})
router.get('/board',(req,res)=>{
    res.status(200).render('Board',{
        title:'board',
        id:req.query.id,
        name:req.query.name
    })
})
io.on('connect',(socket)=>{
socket.on('join',({name},callBack)=>{
const {user,error}=userAdded({id:socket.id,name:name})
if(!user){
callBack({error:error})
console.log(error)
return;
}
else{
    callBack({id:user.id,error:"ok"})
}
console.log(user.id)
console.log(socket.id)
})
socket.on('mainCoonection',(user)=>{
socket.join(user.id)
socket.emit('message',{user:'admin',text:`${user.name} joined`})
socket.broadcast.to(user.id).emit('message',{user:'admin',text:`${user.name} joined`,opp:user.name})
})
socket.on('sendMes', (message,callBack) => {
    console.log(message)
    io.to(message.id).emit('message',message)
    console.log("sended")
  })
socket.on('joinRoom',({id,name},callBack)=>{
const {user,error}=userRoomcheck({id,name})
console.log(user)
console.log(error)
if(error){
    callBack({error:error})
    return;
}
else{
   callBack({id:user.id,error:error})
}
})
}
)
app.use(router);
server.listen(5000,()=>console.log('this is running in 5000'))