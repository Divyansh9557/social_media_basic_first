import express from "express"
import { protectedRoute } from "../middlewares/protectedRoute.js"
import { getNotifiaction,deleteNotification,deleteThatNotification } from "../controllers/notification.controller.js"

const router = express.Router()

router.get('/',protectedRoute,getNotifiaction)
router.delete('/',protectedRoute,deleteNotification)
router.delete('/:id',protectedRoute,deleteThatNotification)

export default router