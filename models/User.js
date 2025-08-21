// User Model:
// username: String, required, unique.
// email: String, required, unique, must be a valid email format.
// password: String, required. Must be hashed using bcryptjs before being saved.
// role: String, with an enum of ['User', 'Moderator'], and a default value of 'User'.
const mongoose=require('mongoose');
const userScheme=new mongoose.Schema({
    name:{type:String,unique:true,required:true},
    email:{type:String,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:['moderate','user'],default:'user'}
})
const User=new mongoose.model("User",userScheme)
module.exports=User;