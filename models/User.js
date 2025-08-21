
const mongoose=require('mongoose');
const bcryptjs=require('bcryptjs');

const userSchema=new mongoose.Schema({
    username:{type:String,unique:true,required:true,trim:true},
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    password:{type:String,required:true,minlength:6},
    role:{type:String,enum:['User','Moderator'],default:'User'}
},{timestamps:true});


userSchema.pre('save', async function(next){
    if(!this.isModified('password')) 
        return next();
    try {
        const salt=await bcryptjs.genSalt(10);

        this.password=await bcryptjs.hash(this.password,salt);

        next();
    } catch(err){
        next(err);
    }
});

const User=mongoose.model('User',userSchema);
module.exports=User;