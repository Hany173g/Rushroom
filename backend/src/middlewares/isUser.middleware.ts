import jwt from "jsonwebtoken"
import { Request,Response,NextFunction } from "express"
import {getUserByGoogleIdNoThrow} from "../utils/user/user-helper.utils.js"
import {payloadType} from "../types/auth.types.js"










// middleware to check if user sign or guest

export default async function isUser(req : Request,res : Response , next: NextFunction) {
    try {
        
        // check if header is find
        const header = req.headers['authorization']
        if (!header || !header.toLowerCase().startsWith("bearer ")) {
            req.authUser = null
            return next()
        }
        let token = header.split(" ")[1]
        if (!token) {
            req.authUser = null
            return next()
        }
        let decoded  = jwt.verify(token, process.env.ACCESS_TOKEN as string)

        // check if type not string to skip typescript compiler
        if (typeof decoded === "string")  {
            req.authUser = null
            return next()
        }
        const payload = decoded as payloadType
        const path = req.path
        // Allow completeUserProfile endpoint for pending users
        if (path === '/auth/completeUserProfile' && req.method === 'POST') {
            req.authUser = payload
            return next()
        }
        
        // check if user is new to complete profile 
        let user = await getUserByGoogleIdNoThrow(payload.googleId)
        if (user) {
            if (user.status == "pending") {
                // Allow pending users to access completeUserProfile
                req.authUser = payload
                return res.status(403).json({
                    status: "fail",
                    message: "Profile completion required",
                    code: "PROFILE_INCOMPLETE",
                    data: {
                        userId: user._id,
                        redirectUrl: `${process.env.FRONTEND_URL}/complete-profile`
                    }
                })
            }
        } else {
            // if user id not find in database 
            req.authUser = null
            return next()
        }
        req.authUser = payload
        next()
    }catch(err) {
        req.authUser = null
        next(err)
    }
}