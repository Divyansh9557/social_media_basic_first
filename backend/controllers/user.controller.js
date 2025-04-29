import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';

import { asyncHandler } from "../utils/asyncHandler.js"
export const getUserProfile= asyncHandler(async (req,res)=>{
    const {username}=req.params;
  try {
    const user= await User.findOne({username}).select("-password")
    if(!user){
       return res.status(400).json({error:"user not found"})
    }

    res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({error:"user not found"})
  }
    
})
export const suggestUser= asyncHandler(async (req,res)=>{ 
    const user=req.user._id
    const userFollowed= await User.findById(user).select("following")
    const suguser= await User.aggregate([
      {
        $match:{
          _id:{$ne:user}
        },
        
      },
      {$sample:{size:10}}
    ])
    const filterUser= suguser.filter((curr)=> !userFollowed.following.includes(curr._id) )
   const suggestedUsers= filterUser.splice(0,4  )
   suggestedUsers.forEach((curr)=> {curr.password=null})

   res.status(200).json(suggestedUsers);
  })
export const followAndUnfollow= asyncHandler(async (req,res)=>{
    // const{id}= req.params
    // const modifyUser=await User.findById(id)
    // const currentuser=await User.findById(req.user._id)

    // if(id===req.user._id.toString()) return res.status(400).json({error:"can follow to yourself"})

    //     const isFollowing = currentuser.following.includes(id)

    //     if(isFollowing){ // for infollowing the user
    //            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}})
    //            await User.findByIdAndUpdate(id,{$pull:{follower:req.user._id}})
    //     }
    //     else{
    //         // for following the user
    //         await  User.findByIdAndUpdate(id,{$push:{follower:req.user._id}})
    //         await User.findByIdAndUpdate(req.user._id,{$push:{following:id}})
              
    //     }

    const {id}=req.params
    const modifyUser= await User.findById(id)
    const currentUser= await User.findById(req.user._id)

    if(id===req.user._id.toString()){
    return    res.status(400).json({error:"you dont unfollow your self"})    
 }
 if(!modifyUser || !currentUser) {
    return res.status(404).json({error:"user not found"})
 }
 const isFollowing=  currentUser.following.includes(id)


 if(isFollowing){
     // unfollow the id wala user 
      await User.findByIdAndUpdate(id,{$pull:{follower:req.user._id}})
      await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}})
     
      res.status(200).json("user unfollow succesfully")
 }
 else{
    await User.findByIdAndUpdate(id,{$push:{follower:req.user._id}})
    await User.findOneAndUpdate(req.user._id,{$push:{following:id}})
    const notification= new Notification({
        to:id,
        from:req.user._id,
        type:"follow",
      })

      await notification.save()
    res.status(200).json("user follow succesfully")
 }


})


export const updateUserProfile= asyncHandler(async (req,res)=>{
   const {fullName,bio,username,email,link,currentPassword,newPassword}=req.body
   let {profileImg,coverImg}= req.body

   let user= await User.findById(req.user._id);
   if(!user) return res.status(404).json({error:"user not found"})

    if((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
      return res.status(404).json({error:"both current password and new password required "})
    }
    if(currentPassword && newPassword){
        const checkPass= await bcrypt.compare(currentPassword,user.password)

        if(!checkPass) {
          return res.status(404).json({error:"password is incorrect"})
        }
        const salt= await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(newPassword,salt);
    }
    if(profileImg){
      const uploadresponse = await cloudinary.uploader.upload(profileImg)
      profileImg=uploadresponse.secure_url;
}

if(coverImg){
      const uploadResponse= await cloudinary.uploader.upload(coverImg)
      coverImg= uploadResponse.secure_url
}

user.fullName=   fullName || user.fullName 
user.email=  email|| user.email 
user.bio=  bio|| user.bio 
user.link=  link || user.link 
user.username= username|| user.username 
user.profileImg=profileImg || user.profileImg
user.coverImg= coverImg || user.coverImg

const resuser= await user.save();

resuser.password=null

res.status(200).json(resuser)
}) 