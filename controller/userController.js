import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import validator from 'validator'



// login user
const loginUser=async(req,res)=>{
const {email,password} = req.body;
try{
    const user=await userModel.findOne({email})
    if(!user){
        return res.json({success:false,message:"User not found"})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.json({success:false,message:"Wrong password"})
    }
    const token=createToken(user._id)
    res.json({success:true,token})

    
}
catch(error) {
    console.log(error);
    res.json({success:false,message:"error"})
}

}


const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//SignUp user
const resisterUser = async(req,res)=>{
    const {name,password,email} = req.body;
    try {
        const exist=await userModel.findOne({email})
        if(exist){
            return res.json({success:false,menubar:"user already registered"})
        }
        // validate email format and password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid email"})
        }
        if(!validator.isLength(password,{min:8})){
            return res.json({success:false,message:"Password should be at least 8 characters"})
        }

        // hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        // create new user
        const newUser = new userModel({name:name,
                                     email:email,
                      password:hashedPassword})
      const user=  await newUser.save();
      const  token=createToken(user._id)
      res.json({success:true,token})
       
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
 
        
    }
}







export {loginUser,resisterUser}