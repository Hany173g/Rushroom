import {Request , Response , NextFunction} from "express"
import {createUser} from "../../utils/user/create-user.utils.js"
import {checkUserAuth,updateUserData , getUserByGoogleId} from "../../utils/user/user-helper.utils.js"
import { payloadType } from "../../types/auth.types.js"
import { Types } from "mongoose"
import { generateAccessToken } from "../../auth/generateToken.js"
import { AppError } from "../../utils/errorHandling/appError.js"
import {UserDocument} from "../../models/user.model.js"


// callback from google and create user and redirect to frontend callback
export async function authGoogleCallBack(req : Request , res : Response , next : NextFunction) {
    try {
        const profile = req.user as payloadType & { _id?: Types.ObjectId }
        if (!profile) throw new AppError("لم يتم ارسال البينات" , 500) 
        const frontendUrl = process.env.FRONTEND_URL as string
        let user = await createUser(profile)
        profile._id = user._id
        let token = generateAccessToken(profile)
        res.redirect(`${frontendUrl}/auth/callback?token=${token}`)
    } catch(err : any) {
        console.log(err.message)
        next(err)
    }
}







// complete profile user to choice photo from the gender
export async function completeUserProfile(req : Request , res : Response , next : NextFunction) {
    try {
        let user = await checkUserAuth(req)
        if (user.status != "pending") res.redirect(`${process.env.FRONTEND_URL}`)
        const {userData} = req.body
        let userUpdate = await updateUserData(user._id , userData)
        res.status(201).json({userUpdate})
    } catch(err) {
        next(err)
    }
}


export async function getUserData(req : Request  , res : Response , next : NextFunction) {
    try {
        let user = await checkUserAuth(req)
        res.status(200).json({user})
    } catch (err) {
        next(err)
    }
}






