const User=require('../models/User.js');
const bcryptjs=require('bcryptjs')
// / User Model:
// username: String, required, unique.
// email: String, required, unique, must be a valid email format.
// password: String, required. Must be hashed using bcryptjs before being saved.
// role: String, with an enum of ['User', 'Moderator'], and a default value of 'User'.
exports.signup=async(req,res)=>{
  try {
   const {usernmae,email,password,role}=req.body;
  const salt= await bcryptjs.genSalt(10);
   const hashedPassowrd=bcryptjs.hash(password,salt);
   const user=new User(usernmae,email,hashedPassowrd,role).save();
   res.status(201).json(user)
  } catch (error) {
    res.status(500).send("Something went wrong")
  }
}

