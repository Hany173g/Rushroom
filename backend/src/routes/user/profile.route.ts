import express from "express"
import {getProfileData,updateProfileData} from "../../contoller/user/profile.contoller.js"
import  parser from "../../config/multer.config.js"

let router = express.Router()








router.get("/getUserProfile" , getProfileData)
router.patch("/updateProfileData" , parser.single("image") , updateProfileData )


export default router