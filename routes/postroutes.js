const express=require('express');
const router=express.Router();
const { createPost, getAllPosts, getById, deletePost, postComment, upvote, getComments, updateComment, deleteComment } = require('../controller/postController');
const { authenticate, authorizeRole } = require('../middlwares/auth');

router.post('/', authenticate, createPost);

router.get('/', getAllPosts);

router.delete('/:id', authenticate, deletePost);

router.post('/:id/comments', authenticate, postComment);

router.get('/:id/comments', getComments);

router.put('/:id/comments/:commentId', authenticate, updateComment);

router.delete('/:id/comments/:commentId', authenticate, deleteComment);

router.post('/:id/upvote', authenticate, upvote);

router.get('/:id', getById);

module.exports=router;