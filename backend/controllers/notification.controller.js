import { asyncHandler } from "../utils/asyncHandler.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifiaction=asyncHandler(async (req,res)=>{
    const user= await User.findById(req.user._id)

    if(!user) return res.status(400).json({error:"user not found"})

    

    const notify= await Notification.find({to:{$eq:user}}).populate({path:"from",select:"username profileImg"})
    
    await Notification.updateMany({to:req.user._id},{read:true})

    res.status(200).json(notify)
})

export const deleteNotification = asyncHandler(async (req,res)=>{
    const user= await User.findById(req.user._id)

    if(!user) return res.status(400).json({error:"user not found"})

        await Notification.deleteMany({to:req.user._id})

        res.status(200).json({message:"notification delete succesfully"})

})
export const deleteThatNotification = asyncHandler(async (req,res)=>{
    const {id}=req.params
    const userid=req.user._id

    const notify= await Notification.findById(id)
    if(!notify){
       return res.status(200).json({error:"notification not found"})
    }

    if(notify.to !==userid)  return res.status(200).json({error:"you are mot authorize to delete this notification"})

        await Notification.findByIdAndDelete(id)

        res.status(200).json({message:"notification is delete"})
})

