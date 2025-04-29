import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { uploadPost,deletePost,commentOnPost,likeOnPost,getAllPost,getLikedPost, getFollowingPost,getUserPost } from "../controllers/post.controller.js";

const  router= express.Router()

router.post('/upload',protectedRoute,uploadPost)
router.get('/likes/:id',protectedRoute,getLikedPost)
router.delete('/:id',protectedRoute,deletePost)
router.post("/comment/:id",protectedRoute,commentOnPost)
router.post("/like/:id",protectedRoute,likeOnPost)
router.get("/all",protectedRoute,getAllPost)
router.get('/following',protectedRoute,getFollowingPost)
router.get('/user/:username',protectedRoute,getUserPost)

export default router 