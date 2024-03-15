let array=[]
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
    let update=array.filter(item=>item?.id!==id)
    array=update
    console.log(array)
    const user={id,name:finding[0].name}
    return {user}
  }
  else{
    return {error:"room is invalid"}
  }
}
module.exports={userAdded,userRoomcheck}