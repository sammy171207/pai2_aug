const Post=require('../models/Post');

// Basic site stats
exports.getStats=async(req,res)=>{
    try{
        const [totalPosts, totalCommentsAgg] = await Promise.all([
            Post.countDocuments({}),
            Post.aggregate([
                {$unwind: { path: '$comments', preserveNullAndEmptyArrays: true }},
                {$group: {_id:null, count: {$sum: {$cond: [{$ifNull:['$comments', false]}, 1, 0]}}}}
            ])
        ]);
        const totalComments = totalCommentsAgg[0]?.count || 0;
        res.json({ totalPosts, totalComments });
    }catch(err){
        res.status(500).json({message:'Failed to get stats'});
    }
}

// Top 3 active users by number of posts + comments
exports.getTopActiveUsers=async(req,res)=>{
    try{
        const agg=await Post.aggregate([
            { $group: { _id: '$author', posts: { $sum: 1 }, comments: { $sum: { $size: { $ifNull: ['$comments', []] } } } } },
            { $addFields: { activity: { $add: ['$posts', '$comments'] } } },
            { $sort: { activity: -1 } },
            { $limit: 3 }
        ]);
        res.json(agg);
    }catch(err){
        res.status(500).json({message:'Failed to get top users'});
    }
}

// Most upvoted posts (top 5)
exports.getMostUpvotedPosts=async(req,res)=>{
    try{
        const posts=await Post.aggregate([
            { $addFields: { upvoteCount: { $size: { $ifNull: ['$upvotes', []] } } } },
            { $sort: { upvoteCount: -1 } },
            { $limit: 5 }
        ]);
        res.json(posts);
    }catch(err){
        res.status(500).json({message:'Failed to get most upvoted posts'});
    }
}


