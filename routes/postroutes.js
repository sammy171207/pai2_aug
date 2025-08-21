const express=require('express');
const router=express.Router();
const { createPost, getAllPosts, getById, deletePost, postComment, upvote, getComments, updateComment, deleteComment } = require('../controller/postController');
const { authenticate, authorizeRole } = require('../middlwares/auth');

// Create a post (authenticated users only)
router.post('/', authenticate, createPost);

// Get all posts
router.get('/', getAllPosts);

// Only the user who created the post or a Moderator can delete it
router.delete('/:id', authenticate, deletePost);

// Add a comment to a post (authenticated users)
router.post('/:id/comments', authenticate, postComment);

// Get comments for a post
router.get('/:id/comments', getComments);

// Update a comment
router.put('/:id/comments/:commentId', authenticate, updateComment);

// Delete a comment
router.delete('/:id/comments/:commentId', authenticate, deleteComment);

// Upvote a post (authenticated users)
router.post('/:id/upvote', authenticate, upvote);

// Get a single post by id (keep after comment routes to avoid conflicts)
router.get('/:id', getById);

module.exports=router;