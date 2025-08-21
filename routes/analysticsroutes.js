const express=require('express');
const router=express.Router();

const { authenticate, authorizeRole } = require('../middlwares/auth');
//only moderator can see 
router.get('/stats', authenticate, authorizeRole('Moderator'), getStats);
router.get('/top-users', authenticate, authorizeRole('Moderator'), getTopActiveUsers);
router.get('/most-upvoted', authenticate, authorizeRole('Moderator'), getMostUpvotedPosts);

module.exports=router;