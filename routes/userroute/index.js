var express=require("express")
// import express from 'express'
 
const router=express.Router();
const exe=require('../../views/connection')
//  const upload=require('express-fileupload');
const session = require("express-session");
var sendMail=require('../../views/Gmail')

router.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'gimmy'
}))

 router.use(express.static("public/"))
 router.use(express.urlencoded({extended:true}));
 router.use(express.json())
//  router.use('/cart', express.static(path.join(__dirname, 'cart')));

router.get('/',async(req,res)=>{
//   const result=  await axios.get('http://localhost:3000/cards')
//   console.log(result.data)
// //   const res=result.data

var sql='SELECT * From Product WHERE p_category=?'
const result=await exe(sql,['Carousel'])


  const obj={data:result}
    res.render('./user/home.ejs',obj)
})
 router.get('/carts',async(req,res)=>{
    const sql='SELECT * FROM cartData'
    const result= await exe(sql);
    const obj={data:result}
    res.render('./user/cartData.ejs',obj)
 })

 router.get('/remove/:id',async(req,res)=>{
    const _id=req.params.id;
    const sql="DELETE FROM cartData WHERE p_id=?"
    await exe(sql,[_id])
    res.redirect('/carts')
})

router.get('/cart/:id',async(req,res)=>{
    // if(req.session.loginid){
    const _id=req.params.id;
    // const result=await axios.get(`http://localhost:3000/cards/${_id}`)
    
    const sql='SELECT * FROM Product WHERE p_id=?';
    const result=await exe(sql,[_id])
    console.log(result[0])
    const product=result[0];
    // const{p_name,p_description,p_price,p_category,p_image,p_quantity}=product;
    const insertsql="INSERT INTO cartData(p_name,p_description,p_price,p_category,p_image)values(?,?,?,?,?)"
    await exe(insertsql,[product.p_name,product.p_description,product.p_price,product.p_category,product.p_image])

    const obj={data:result}
        res.render('./user/cart.ejs',obj)
    // }else{
    //     res.redirect('/login')
            
    // }
})

router.get('/buy/:id',async(req,res)=>{
    const _id=req.params.id
    const sql='SELECT * FROM Product WHERE p_id=?';
    const result=await exe(sql,[_id])
    console.log(result)
    const obj={data:result}
    // if(req.session.loginid){
        res.render('./user/buyitem.ejs',obj)        
    // }
    // else{
    //     res.redirect('/login')
    // }
})

router.get('/signup',(req,res)=>{
    res.render('./user/signup.ejs')
})

router.get('/login',(req,res)=>{
    res.render('./user/login.ejs')
})

// router.get('/menu',(req,res)=>{
// //    if(req.session.loginid){
//     res.render('./user/menu.ejs')
// //    }else{
// //     res.redirect('/login')
// //    }
// })
router.get('/lunch',async(req,res)=>{
    // if(req.session.loginid){
    const sql='SELECT * FROM Product WHERE p_category=?';
    const result=await exe(sql,['Lunch'])
    const obj={data:result}
        res.render('./user/lunch.ejs',obj)
    // }else{
    //     res.redirect('/login')
    // }
})
router.get('/drinks',async(req,res)=>{
    const sql='SELECT * FROM Product WHERE p_category=?';
    const result=await exe(sql,['Drinks'])
    const obj={data:result}
    res.render('./user/Drinks.ejs',obj)
})
router.get('/dinner',async(req,res)=>{
    const sql='SELECT * FROM Product WHERE p_category=?';
    const result=await exe(sql,['Dinner'])
    const obj={data:result}
    res.render('./user/Dinner.ejs',obj)
})
router.get('/breakfast',async(req,res)=>{
    const sql='SELECT * FROM Product WHERE p_category=?';
    const result=await exe(sql,['Breakfast'])
    const obj={data:result}
    res.render('./user/breakfast.ejs',obj)
})

router.post('/saveform',async(req,res)=>{
    
    try{
    
        const{username,useremail,userpass,usermobile}=req.body;
        const sql=`insert into Signup (username,useremail,userpass,usermobile) values(?,?,?,?)`;
        const data=[username,useremail,userpass,usermobile]
        const result=await exe(sql,data)
        console.log(result)
        
       

    var otp=Math.trunc(Math.random()*10000)
    req.session.otp=otp
        sendMail(req.body.useremail,otp)
        
        res.redirect('/accept_otp')
    
} catch (error) {
    console.error(error);
 }
})

router.get('/accept_otp',(req,res)=>{
    if(req.session.otp){

        res.render('./user/accept_otp.ejs')
    }else{
        res.redirect('/signup')
    }
})

router.post('/verify_otp',(req,res)=>{
    const sessionotp=req.session.otp;
    const userotp=req.body.otp;
    console.log(sessionotp,userotp)
    if(sessionotp==userotp){         
        res.redirect('/login')
    }
    else{
         
           res.send( `<script>
        alert("OTP Not Match ")
        window.location.href='/accept_otp'
        </script>`)
    }
})

router.post('/logindata',async(req,res)=>{
  
   
    const{useremail,userpass}=req.body;
    const sql="select * from Signup where useremail=? And userpass=? ;"   
    const result=await exe(sql,[useremail,userpass])
     console.log(result)
    if(result.length > 0){
        req.session.loginid=result[0].sign_id;
        res.send(`<script>
            alert('Login Successfully')
            window.location.href='/'
            </script>`)
        }else{
            res.send(`<script>
                alert('User Not Found')
                window.location.href='/login'
                </script>`)
            }
           
})


//buy items

router.get('/buying/:id',async(req,res)=>{
    const _id=req.params.id
    const  sql='SELECT * FROM Product WHERE p_id=?'
    const result=await exe(sql,[_id])
    const obj={data:result}
    res.render('user/shift_add.ejs',obj)
})

 
module.exports=router; 