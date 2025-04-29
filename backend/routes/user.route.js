import express from "express"
import { getUserProfile,suggestUser,followAndUnfollow,updateUserProfile } from "../controllers/user.controller.js"
import { protectedRoute } from "../middlewares/protectedRoute.js"

const router = express.Router();

  router.get("/profile/:username",protectedRoute, getUserProfile)
  router.get("/suggested",protectedRoute,suggestUser)
  router.post("/follow/:id",protectedRoute,followAndUnfollow)
  router.post("/update",protectedRoute,updateUserProfile)
  



export default router