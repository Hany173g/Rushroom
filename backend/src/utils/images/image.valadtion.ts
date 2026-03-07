
import {getUserById} from "../user/user-helper.utils.js"
import {Types} from "mongoose"
import cloudinary from "../../config/cloudinary.config.js"






export async function deleteLastImage(id : Types.ObjectId) {
    let user = await getUserById(id)
    let malePhoto : string = "https://res.cloudinary.com/dtt1a0arw/image/upload/v1772725188/malePhoto_voe9lt.png"
    let femalePhoto : string = "https://res.cloudinary.com/dtt1a0arw/image/upload/v1772725200/femalePhoto_lw3gez.png"
    if (user.photo == malePhoto || user.photo == femalePhoto) return
    const public_id = user.photo.split("/").slice(-2).join("/").replace(/\.[^/.]+$/, "");
    let result = await cloudinary.uploader.destroy(public_id)
    console.log(result)
}