import jwt from 'jsonwebtoken';
const authMiddleware =async (req,res,next)=>{
const {token} = req.headers;
if(!token){
    return res.json({success:false,message:"No token provided"})
}
console.log( token);
try {
    console.log(process.env.JWT_SECRET)
    const token_decode=jwt.verify(token,process.env.JWT_SECRET);
    console.log("Token decoded successfully:", token_decode);
    req.body.userId=token_decode.id;
    console.log(token_decode.id);
    next();
} catch (error) {
    console.log(error);
 res.json({success:false,message:"Token is not valid"})
    
}
}


export default authMiddleware;