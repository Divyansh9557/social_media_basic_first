import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {v2 as cloudinary} from 'cloudinary'

export const uploadPost= asyncHandler(async (req,res)=>{
    const {title}=req.body
    let {img}=req.body
    const user= await User.findById(req.user._id)
    if(!user){
        return res.status(200).json({error:"title and image is required"})
    }

    if(!title && !img){
        return res.status(200).json({error:"title and image is required"})
    }
    if(img){
        const imageResponse= await cloudinary.uploader.upload(img)
        img=imageResponse.secure_url
    }

    const post = await Post.create({
        user:req.user._id.toString(),
        title,
        img
    })

    res.status(201).json(post)
    

})

export const deletePost=asyncHandler(async (req,res)=>{
    const {id}= req.params
    // console.log(id)

    const post = await Post.findById(id)

    if(!post ){
      return  res.status(400).json({error:"post not found"})
    }

    if(post.user.toString() !== req.user._id.toString()){
        return  res.status(400).json({error:"you are not authorized to delete this post"})
    }
    if(post.img){
        const imgId=post.img.split("/").pop().split(".")[0]
        cloudinary.uploader.destroy(imgId)
    }
    await Post.findByIdAndDelete(id)
    res.status(200).json({message:"post delete succesfully"})
})

export const commentOnPost =asyncHandler(async (req,res)=>{
    const {text}=req.body
    const user= req.user._id
    const postId= req.params.id


    if(!text){
        res.status(200).json({error:"text is required for comment"})
    }
const post = await Post.findById(postId)
if(!post){
    res.status(200).json({error:"post not found"})
}
  const comment ={text,user}

  post.comments.push(comment)
  await post.save()

  res.status(200).json(post)

})

export const likeOnPost= asyncHandler(async (req,res)=>{
    const postID= req.params.id
    const userID=req.user._id

    const post =await Post.findById(postID)

    if(!post){
        return res.status(400).json({error:"post not found"})
    }

    const checkLike= post.like.includes(userID)

    if(checkLike){
             // unlike

             await Post.findByIdAndUpdate(postID,{$pull:{like:userID}})
             await User.findByIdAndUpdate(userID,{$pull:{likedPost:postID}})
             const updatedLikes = post.like.filter((curr)=> curr.toString() !==userID.toString())
             res.status(200).json(updatedLikes)
    }
    else{
           await Post.findByIdAndUpdate(postID,{$push:{like:userID}})
           await User.findByIdAndUpdate(userID,{$push:{likedPost:postID}})

           
           await Notification.create({
            to:post.user,
            from:userID,
            type:"like"
           })
           const postupdated= await Post.findById(postID); 
             
           res.status(200).json(postupdated.like)
    }
    
})

export const getAllPost= asyncHandler(async (req,res)=>{
    const post = await Post.find().sort({createdAt:-1}).populate({path:"user",select:"-password"})
    .populate({path:"comments.user",select:"-password"})
    if(post.length===0){
        return res.status(200).json([])
    }

    res.status(200).json(post)
})

export const getLikedPost= asyncHandler(async (req,res)=>{
    const userID=req.params.id

    const user= await User.findById(userID)
    if(!user){
        return res.status(400).json({error:"user not found"})
    }
    const likedPost= await Post.find({_id:{$in:user.likedPost}})
    .populate({path:"user",select:"-password"})
    .populate({path:"comments.user",select:"-password"})
    
    res.status(200).json(likedPost)
})

export const getFollowingPost= asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user._id)

    if(!user) return res.status(404).json({message:"user not found"})

        const following= user.following

        const posts= await Post.find({user:{$in:following}}).sort({createdAt:-1})
        .populate({path:"user",select:"-password"})
        .populate({path:"comments.user",select:"-password"})
         res.status(200).json(posts)

})


export const getUserPost = asyncHandler(async (req,res)=>{
    const username=req.params.username
    const userneed= await User.findOne({username})
     if(!userneed) return res.status(400).json({error:"user not found"})
      const post= await Post.find({user:{$in:userneed}})  

     res.status(200).json(post)
})