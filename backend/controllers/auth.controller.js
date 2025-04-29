import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateTokenAndCookie } from "../utils/generateToken.js"

export const signup = asyncHandler(async (req,res)=>{
     
    const {username,fullName,password,email} =req.body
    const userCheck= await User.findOne({username});
    if(userCheck){
     return   res.status(400).json({error:"username already exist "})
    }
    const emailCheck= await User.findOne({email});
    if(emailCheck){
       return res.status(400).json({error:"email already exist "})
    }
    const salt= await bcrypt.genSalt(10);
    const hashedPass= await bcrypt.hash(password,salt)

    const newUser= new User({
        fullName:fullName,
        email:email,
        username:username,
        password:hashedPass,
    })

    

    if(newUser){
        generateTokenAndCookie(newUser._id,res)
       await newUser.save();
       res.status(200)
       .json( new ApiResponse(200,{_id:newUser._id,
        fullName:newUser.fullName,
        username:newUser.username,
        email:newUser.email,
        follower:newUser.follower,
        following:newUser.following,
        profileImg:newUser.profileImg,
        coverImg:newUser.coverImg,
    },
     
    )  )
    }
    else{
        throw new ApiError(400,"internal server error")
    }

})
export const login = asyncHandler( async (req,res)=>{
    const {username,password}=req.body
  

    const user= await User.findOne({username});
    if( !user){
        return res.status(400).json({ error:"invalid username"}) 
    }
    const checkPass= await bcrypt.compare(password,user?.password || "")
    if( !checkPass){
        return res.status(400).json ( { error:"invalid password"}) 
    }
    generateTokenAndCookie(user._id,res)

    res.status(200)
    .json(new ApiResponse(200,{
        _id:user._id,
        fullName:user.fullName,
        username:user.username,
        email:user.email,
        follower:user.follower, 
        following:user.following,
        profileImg:user.profileImg,
        coverImg:user.coverImg,
    },"user login succesfully"))
} )
export const logout = asyncHandler(async (req,res)=>{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json("user logout succesfully")
}) 

export const getMe= asyncHandler(async (req,res)=>{
    const user= await User.findById(req.user._id).select("-password")
    res.status(200).json(user)
})  