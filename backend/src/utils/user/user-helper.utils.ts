import User from "../../models/user.model.js";
import {AppError} from "../errorHandling/appError.js"
import {Request} from "express"
import {Types} from "mongoose"
import {userUpdateType} from "../../types/auth.types.js"
import {UserDocument} from "../../models/user.model.js"







// Get User by google id if not find throw error

export async function getUserByGoogleId(googleId:string) {
    try {
        let user = await User.findOne({googleId})
        if (!user) {
            throw new AppError("هذا المستخدم غير موجود" , 404)
        }
        return user
    } catch(err) {
        throw err
    }
}

// Get User by google id but not throw error

export async function getUserByGoogleIdNoThrow(googleId:string) {
    let user = await User.findOne({googleId})   
    return user
}


export function checkGender(gender: string) {
    let allowGenders = ["male","female"]
    if (!allowGenders.includes(gender)) {
        throw new AppError("هذا الجنس غير مسموح بيه" , 400)
    }
}


export async function checkUserAuth(req : Request) {
    if (!req.authUser) {
        throw new AppError("يجب تسجيل الدخول اولأ" , 401)
    }
    let user = await getUserByGoogleId(req.authUser.googleId as any)
    return user
}



// Remove feilds not allow from user update
function removeFeildsNotAllow(userData : any) {
    let blockFeilds : string[] = ["role" , "_id","googleId" , "status" , "createdAt"]
    for(let [key , value] of Object.entries(userData)) {
        if (blockFeilds.includes(key)) {
            delete userData[key]
        }
    }
    return userData
}


function checkName(name : string) {
    // check type name
    if (typeof name !== "string") {
        throw new AppError("بينات الأسم غير صحيحه" , 400)
    }

    // check name roles
    if (name.length < 1 || name.length > 25 ) {
        throw new AppError("يجب ان يكون الأسم اكبر من حرف او اقل من 25 حرف",400)
    }
}



 // update user data allowed name and gender and choose photo from you gender male or female and update user status to approved
export async function updateUserData(userId : Types.ObjectId , userData : userUpdateType) {
    removeFeildsNotAllow(userData)
    if (userData.name) {
        checkName(userData.name)
    }
    if (userData.gender) {
        checkGender(userData.gender)
           // check if user not have a photo to set default photo form a gender
            if (!userData.photo) {
                let malePhoto : string = "https://res.cloudinary.com/dtt1a0arw/image/upload/v1772725188/malePhoto_voe9lt.png"
                let femalePhoto : string = "https://res.cloudinary.com/dtt1a0arw/image/upload/v1772725200/femalePhoto_lw3gez.png"
                if (userData.gender == "male") {
                    userData.photo = malePhoto
                } else {
                    userData.photo = femalePhoto
                }
            }
    }
    userData.status = "Approved"
    let userUpdate = await User.findByIdAndUpdate(userId , userData,  { returnDocument: 'after' })  
    if (!userUpdate) {
        throw new AppError("فشل تحديث بياناتك من فضلك حاول مره اخره" ,500)
    } 
    return userUpdate
}



export async function getUserById(id : unknown) : Promise<UserDocument>{
    if (!id) {
        throw new AppError("المعرف غير موجود" , 400)
    }
    let user = await User.findById(id).select("name role gender status photo createdAt")
    if (!user) {
        throw new AppError("هذا المستخدم غير موجود",404)
    }
    return user
}

export function isValidUserId(userId: any) {
    if (!userId) return false
    return Types.ObjectId.isValid(userId)
}


