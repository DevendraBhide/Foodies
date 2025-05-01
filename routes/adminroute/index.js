var express=require('express')
var exe=require('../../views/connection')

const router=express.Router()
const axios=require('axios') 

const upload=require("express-fileupload")
router.use(express.static("public/"))
router.use(express.urlencoded({extended:true}));
router.use(express.json())
router.use(upload())
 


router.get('/',(req,res)=>{
     if(req.session.adminid){
         res.render("./admin/home.ejs")
     }else{
        res.redirect('/admin/admin_login')
     }
})

router.get('/admin_login',(req,res)=>{
    res.render('./admin/Admin_Login.ejs')
})

router.post('/admin_log',async(req,res)=>{
    console.log(req.body)
    req.session.id=req.body.adminemail
    const{adminemail,adminpass}=req.body
    const sql='SELECT * FROM Admin_Login WHERE adminemail=? and adminpass=?'
    const result=await exe(sql,[adminemail,adminpass])
    console.log(result);
    if(result.length>0){
        req.session.adminid=req.session.id
        res.redirect('/admin/carddata')
    }else{
        res.send(`<script>
            alert('Enter Correct Information')
            window.location.href='/admin/admin_login'
            </script>`)
    }
})
router.get('/carddata',async(req,res)=>{
    // const result=await axios.get("http://localhost:3000/cards")
    // console.log(result)

    const sql='SELECT * FROM Product'
    const result=await exe(sql)
    const obj={data:result}
    if(req.session.adminid){
        res.render("./admin/cardData.ejs",obj)
    }else{
        res.redirect('/admin/admin_login')
    }
})

router.post('/cardsdata',async(req,res)=>{
    // console.log(req.body)
    // console.log(req.files.p_image.name)
    var filename = new Date().getTime() + "_" + req.files.p_image.name;
    req.files.p_image.mv('public/' + filename);
     
     const{p_name,p_description,p_price,p_category}=req.body
     var sql='INSERT INTO Product(p_name,p_description,p_price,p_category,p_image)values(?,?,?,?,?)'
     const data=[p_name,p_description,p_price,p_category,filename]
    const result= await exe(sql,data);
    // console.log(result)
    res.send(`<script>
        alert("Card inserted Successfully")
        window.location.href='/admin'
        </script>`)
})

router.get('/delete/:id',async(req,res)=>{
    const _id=req.params.id
    const sql='DELETE  FROM Product WHERE p_id=?';
    const result=await exe(sql,[_id])
    res.send(`<script>
        confirm('are you sure!!!')
        window.location.href='/admin/carddata'
        </script>`)
})

router.get('/edit/:id',async(req,res)=>{
    const _id=req.params.id;
    const sql='SELECT * FROM Product WHERE p_id=?'
    const result=await exe(sql,[_id])
    // console.log(result[0])
    const obj={data:result[0]}
    res.render('./admin/editcardData.ejs',obj)
})

router.post('/editcarddata', async(req,res)=>{

    if(req.files){
        if(req.files.p_image){
            var filename=new Date().getTime()+"_"+ req.files.p_image.name;
            req.files.p_image.mv('public/'+ filename)

            const sql="UPDATE Product SET p_image=? WHERE p_id=?"
            await exe(sql,[filename,req.body.p_id])
            console.log(req.body.p_id)
        }
    }
    console.log(req.body.p_id)
    const sql="UPDATE Product SET p_name=?,p_description=?,p_price=?,p_category=? WHERE p_id=?"
    const{p_name,p_description,p_price,p_category,p_id}=req.body;
    const data=[p_name,p_description,p_price,p_category,p_id]
    await exe(sql,data)
    res.redirect('/admin/carddata')
})
 
module.exports=router;