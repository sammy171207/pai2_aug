const User=require('../models/User.js');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

exports.signup=async(req,res)=>{
  try {
    const {username,email,password,role} = req.body;
    if(!username || !email || !password){
      return res.status(400).json({message:'username, email and password are required'});
    }
    const existing = await User.findOne({$or:[{email},{username}]});
    if(existing){
      return res.status(409).json({message:'User with email or username already exists'});
    }
    const user = new User({username,email,password,role});
    await user.save();
    const safeUser={ id:user._id, username:user.username, email:user.email, role:user.role };
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(500).json({message:'Something went wrong'});
  }
}

// Login
exports.login=async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({message:'email and password are required'});
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const user=await User.findOne({email: normalizedEmail});
    if(!user){
      return res.status(401).json({message:'Invalid credentials'});
    }
    const match=await bcryptjs.compare(password,user.password);
    if(!match){
      return res.status(401).json({message:'Invalid credentials'});
    }
    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
      return res.status(500).json({message:'Server misconfigured: JWT secret missing'});
    }
    const token=jwt.sign({userId:user._id,role:user.role},jwtSecret,{expiresIn:'7d'});
    res.json({token});
  }catch(err){
    console.error('Login error:', err);
    res.status(500).json({message:'Something went wrong'});
  }
}

