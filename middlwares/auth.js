const jwt=require('jsonwebtoken');

exports.authenticate=(req,res,next)=>{
    const authHeader=req.headers.authorization || '';
    const parts=authHeader.split(' ');
    if(parts.length!==2 || parts[0] !== 'Bearer'){
        return res.status(401).json({message:' missing '});
    }
    const token=parts[1];
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET);
        req.user={ userId: payload.userId, role: payload.role };
        next();
    }catch(err){
        return res.status(401).json({message:'Invalid  token'});
    }
}

exports.authorizeRole=(requiredRole)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({message:'Not authenticated'});
        }
        if(req.user.role !== requiredRole){
            return res.status(403).json({message:'Fon'});
        }
        next();
    }
}


