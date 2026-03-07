import mongoose, { Schema ,HydratedDocument} from "mongoose"


export interface IUser {
    name: string,
    email: string,
    googleId: string,
    role : string , 
    gender : string,
    status:string,
    photo: string
}


const userSchema = new Schema<IUser>({
    name : String,
    email : String,
    googleId : {
        type:String,
        required:true,
        unique:true
    },
    role: 
    { type: String, enum: ['user','admin'], default: 'user' },
    gender: {
        type:String , enum:["male","female" , "other"]
    },
    status:{
        type:String, enum:["Approved","pending"], default:"pending"
    },
    photo : {
        type : String,
        default:"https://res.cloudinary.com/dtt1a0arw/image/upload/v1772754757/download_1_bhbkyx.png"
    }
},
  { timestamps: true }
)



const User = mongoose.model<IUser>("User" , userSchema)
export type UserDocument = HydratedDocument<IUser>

export default User