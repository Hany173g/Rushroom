import express from "express"
import {authGoogleMiddleware , authGoogleCallBackMiddleware} from "../../middlewares/auth.middleware.js"
import {authGoogleCallBack , completeUserProfile,getUserData} from "../../contoller/user/auth.contoller.js"


const router = express.Router()


router.get("/google" , authGoogleMiddleware )
router.get("/google/callback",authGoogleCallBackMiddleware ,authGoogleCallBack)
router.post("/completeUserProfile" , completeUserProfile)
router.get("/getUserData" , getUserData)


export default router