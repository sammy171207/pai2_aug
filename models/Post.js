const mongoose=require('mongoose')

const commentSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    
    text:{type:String,required:true,trim:true},


    createdAt:{type:Date,default:Date.now}
});

const postSchema=new mongoose.Schema({
   title:{type:String,required:true, minlength:5, trim:true},
   content:{type:String,required:true, minlength:20, trim:true},
   author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
   tags:[{type:mongoose.Schema.Types.ObjectId,ref:'Tag'}],
   upvotes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
   comments:[commentSchema]
},{timestamps:true});

const Post=mongoose.model('Post',postSchema);
module.exports=Post;