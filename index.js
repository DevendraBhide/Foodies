var express=require ('express')
const app=express();

app.use(express.static('public/'))
 
// app.get('/',(req,res)=>{
//     res.send("<h2>Hello<h2/>")
// })
 var userRoute=require("./routes/userroute")
 app.use('/',userRoute)

 var adminRoute=require("./routes/adminroute")
 app.use('/admin',adminRoute)
 
const port=process.env.port || 3001;
app.listen(port,()=>{
    console.log(`server run at http://localhost:${port}`)
})