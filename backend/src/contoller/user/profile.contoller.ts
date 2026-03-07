import {Request , Response , NextFunction} from "express"
import {createUser} from "../../utils/user/create-user.utils.js"
import {checkUserAuth,getUserById,updateUserData,isValidUserId} from "../../utils/user/user-helper.utils.js"
import {checkIsVaribleHaveAValue} from "../../utils/valadtion/simpe-valadtion.js"
import {deleteLastImage} from "../../utils/images/image.valadtion.js"







export async function getProfileData(req: Request , res: Response , next : NextFunction) {
    try {
        const {id} = req.query
        
        // Validate user ID format
        if (!isValidUserId(id)) {
            return res.status(400).json({
                status: 'fail',
                message: 'نوع المعرف غير صحيح',
                code: 'INVALID_USER_ID'
            })
        }
        let user = await getUserById(id)
        let isOwner = req.authUser && req.authUser._id 
            ? req.authUser._id.toString() === user._id.toString() 
            : false
        res.status(200).json({user , isOwner})
    } catch(err) {
        next(err)
    }
}



export async function updateProfileData(req : Request , res : Response , next : NextFunction) {
    try {
          let user = await checkUserAuth(req)
          const {userData} = req.body
           // check if not send a photo if userData not undefined
          if (!req.file) {
             checkIsVaribleHaveAValue(userData) 
          } 
          let data  = userData ? JSON.parse(userData) : {}
          if (req.file?.path) {
            data.photo = req.file.path
            await deleteLastImage(user._id)
          }
          let userUpdate = await updateUserData(user._id , data)
          res.status(201).json({userUpdate})
    }catch (err) {
        console.log(err)
        next(err)
    }
}


