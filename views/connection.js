var mysql=require('mysql2')
var util=require('util')

const connection=mysql.createConnection({
    host:'localhost',
    database:'project',
    user:'root',
    password:'dev@123',
    port:3306

})

connection.connect( (err)=>{
    if(err){
        console.log('error is occured')
    }else{
        console.log('connection successfull')
    }    
})
var exe=util.promisify(connection.query).bind(connection)
module.exports=exe;