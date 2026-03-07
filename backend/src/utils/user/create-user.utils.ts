import User from "../../models/user.model.js";
import { payloadType } from "../../types/auth.types.js";
import {AppError} from "../errorHandling/appError.js"
import {UserDocument} from "../../models/user.model.js"



async function checkGoogleId(googleId : string) {
    let user = await User.findOne({googleId})
    return user
}





export async function createUser(payload : any)  : Promise<UserDocument >  {
    try {
        let checkIsGoogleIdFind = await checkGoogleId(payload.googleId)
        if (checkIsGoogleIdFind) return checkIsGoogleIdFind
        let user = await User.create({
            name:payload.name,
            googleId:payload.googleId,
            email:payload.email
        })
        if (!user) {
            throw new AppError("فشل انشاء الحساب",500)
        }
        return user
    } catch(err) {
        throw err
    }
} 


