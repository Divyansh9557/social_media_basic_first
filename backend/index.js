import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"; 
import { v2 as cloudinary } from 'cloudinary';

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"
import connectDB from "./db/index.js";
cloudinary.config({ 
    cloud_name: "do7vyaywl", 
    api_key: "823714316155922", 
    api_secret: "gxSgVEA8l0gYUgaiV3v0ujJ0EPY"
});

const app =express();
dotenv.config();
app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())




connectDB()
.then(()=>{
    app.listen( 8000,()=>{
        console.log(`app is listening on port 8000`);
    } )
})
.catch((err)=>{
    console.log(` error while connecing to app ${err}`)
})

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);
