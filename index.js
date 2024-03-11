const express=require('express')
const app=express()
const path=require('path')
const router=express.Router()
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
app.use(router);
app.listen(5000,()=>console.log('this is running in 5000'))