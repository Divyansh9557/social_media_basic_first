import mongoose from "mongoose";

const postModel= new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  title:{
    type:String,
  },
  img:{
    type:String,
  },
  like:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  }],
  comments:[{
    text:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  }]

},{timestamps:true})


const Post = mongoose.model("Post",postModel)

export default Post