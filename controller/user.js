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
module.exports={userAdded}