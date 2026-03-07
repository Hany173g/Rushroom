import {Types} from "mongoose"

// Payload from google Type
export type payloadType = {
    name : string,
    googleId : string , 
    email : string,
    _id: Types.ObjectId
}



export type userUpdateType =  {
    name?: string,
    email?: string, 
    gender ?: string,
    status?:string,
    photo?: string
}

