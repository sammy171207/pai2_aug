const Post=require('../models/Post');
const Tag=require('../models/Tag');
const mongoose = require('mongoose');

exports.createPost=async(req,res)=>{
    try{
        const {title,content,tags}=req.body;
        if(!title || !content){
            return res.status(400).json({message:'title and contentrequired'});
        }
        const trimmedTitle = String(title).trim();
        const trimmedContent = String(content).trim();
        if(trimmedTitle.length < 5){
            return res.status(400).json({message:'title must be at characters'});
        }
        if(trimmedContent.length < 20){
            return res.status(400).json({message:'content st 20 characters'});
        }

        let tagIds = [];
        if(Array.isArray(tags) && tags.length > 0){
            const resolved = await Promise.all(tags.map(async (t)=>{
                if(typeof t === 'string'){
                    const val = t.trim();
                    if(!val) return null;
                    if(mongoose.Types.ObjectId.isValid(val)){
                        return val;
                    }
                    let tagDoc = await Tag.findOne({ name: val });
                    if(!tagDoc){
                        tagDoc = await Tag.create({ name: val });
                    }
                    return tagDoc._id;
                }
                return null;
            }));
            tagIds = resolved.filter(Boolean);
        }

        const newPost=await Post.create({
            title: trimmedTitle,
            content: trimmedContent,
            author:req.user.userId,
            tags: tagIds
        });
        res.status(201).json(newPost);
    }catch(err){
        console.error('Create post error:', err);
        if(err.name === 'ValidationError' || err.name === 'CastError'){
            return res.status(400).json({message: err.message});
        }
        res.status(500).json({message:'Failed'});
    }
}

exports.getAllPosts=async(req,res)=>{
    try{
        const posts=await Post.find({})
            .populate('author','username role')
            .populate('tags','name')
            .sort({createdAt:-1});
        res.json(posts);
    }catch(err){
        res.status(500).json({message:'Failed to fetch posts'});
    }
}

exports.getById=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
            .populate('author','username role')
            .populate('tags','name')
            .populate('comments.user','username');
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        res.json(post);
    }catch(err){
        res.status(500).json({message:'Failed to fetch post'});
    }
}

exports.getComments=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
            .populate('comments.user','username');
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        res.json(post.comments);
    }catch(err){
        res.status(500).json({message:'Failed to fetch comments'});
    }
}

exports.deletePost=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        const isOwner=post.author.toString()===req.user.userId;
        const isModerator=req.user.role==='Moderator';
        if(!isOwner && !isModerator){
            return res.status(403).json({message:'Not allowed to delete '});
        }
        await post.deleteOne();
        res.json({message:'Post deleted'});
    }catch(err){
        res.status(500).json({message:'Failed to delete post'});
    }
}

// Add comment
exports.postComment=async(req,res)=>{
    try{
        const {text}=req.body;
        if(!text){
            return res.status(400).json({message:'text is required'});
        }
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        post.comments.push({user:req.user.userId,text});
        await post.save();
        res.status(201).json(post);
    }catch(err){
        res.status(500).json({message:'Failed to add comment'});
    }
}

exports.updateComment=async(req,res)=>{
    try{
        const { text }=req.body;
        if(!text){
            return res.status(400).json({message:'text is required'});
        }
        const { id, commentId } = req.params;
        const post=await Post.findById(id);
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        const comment=post.comments.id(commentId);
        if(!comment){
            return res.status(404).json({message:'Comment not found'});
        }
        const isOwner=comment.user.toString()===req.user.userId;
        const isModerator=req.user.role==='Moderator';
        if(!isOwner && !isModerator){
            return res.status(403).json({message:'Not allowed to edit this comment'});
        }
        comment.text=text;
        await post.save();
        res.json(comment);
    }catch(err){
        res.status(500).json({message:'Failed to update comment'});
    }
}

// Delete a comment (owner or Moderator)
exports.deleteComment=async(req,res)=>{
    try{
        const { id, commentId } = req.params;
        const post=await Post.findById(id);
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        const comment=post.comments.id(commentId);
        if(!comment){
            return res.status(404).json({message:'Comment not found'});
        }
        const isOwner=comment.user.toString()===req.user.userId;
        const isModerator=req.user.role==='Moderator';
        if(!isOwner && !isModerator){
            return res.status(403).json({message:'Not allowed to delete this comment'});
        }
        comment.deleteOne();
        await post.save();
        res.json({message:'Comment deleted'});
    }catch(err){
        res.status(500).json({message:'Failed to delete comment'});
    }
}

// Upvote post (toggle)
exports.upvote=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        const userId=req.user.userId;
        const index=post.upvotes.findIndex(id=>id.toString()===userId);
        if(index>=0){
            post.upvotes.splice(index,1);
        }else{
            post.upvotes.push(userId);
        }
        await post.save();
        res.json({upvotes:post.upvotes.length});
    }catch(err){
        res.status(500).json({message:'Failed to upvote'});
    }
}


