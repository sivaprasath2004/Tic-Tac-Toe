let array=[]
let opponents=[]
let playerchanger=[]
const userAdded=({id,name})=>{
    console.log('adduser')
  if(!id && !name){
    return {error:"name is required"}
  }
  name=name.trim().toLowerCase()
  if(array.length){
    console.log('second')
    let finding=array.find(item=>item?.id==id)
    if(finding){
        return {error:'user alredy existed'}
    }
  }
  const user={id,name}
  array.push(user)
  return {user}
}
const userRoomcheck=({id,name})=>{
  console.log('userCheck')
  let finding=array.filter(item=>item?.id===id)
  if(finding?.length==1){
    opponents.push(id)
    const user={id,name:finding[0].name}
    return {user}
  }
  else{
    return {error:"room is invalid"}
  }
}
const matchStart=({id,name})=>{
  let finding=opponents.filter(item=>item===id)
  if(finding?.length==1){
    let val=array.find(item=>item.id===id)
    let user={id:id,player1:val.name,palyer2:name}
    playerchanger.push(user)
    return {start:'Start the Match',player1:val.name,palyer2:name,res:'ok'}
  }
  else{
    return {error:'Finding your opponent'}
  }
}
const changeplayer=({id,player})=>{
  console.log("playerss",player)
   let players=playerchanger.find(item=>item.id===id)
   console.log("players",players)
   let currentPlayer=player===players.player1?players.palyer2:players.player1
   console.log(currentPlayer)
   return {currentPlayer}
}
module.exports={userAdded,userRoomcheck,matchStart,changeplayer}