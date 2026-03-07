import { Request  , Response , NextFunction } from "express";
import dotenv from "dotenv"
import {IAppError} from "../utils/errorHandling/appError.js"
dotenv.config()




// custom handle errors

function duplicateMongodb(err : any , res : Response) {
     const duplicateField = Object.keys(err.keyValue)[0];
     res.status(500).json({message:`${duplicateField} موجود بلفعل من فضلك جرب قيمه اخره`})
}





// if error is handling send a message if not send once message "خطاء غير معروف"
function sendToProduction(err : IAppError , res : Response) {
    if (err.isOperational) {
        res.status(err.statusCode).json({message : err.message})
    }
    else {
        res.status(500).json({message:"خطاء غير معروف"})
    }
}


// send all error to dev node to fix
function sendToDev(err : any , res : Response ) {
    res.status(err.statusCode || 500).json({
        status: 'fail',
        message: err.message,
        code: err.code || 'ERROR',
        ...(err.details && { details: err.details })
    })
}



export default function ErrorHandling(err : any , req : Request , res : Response , next : NextFunction) {
    if (err.code == 11000) duplicateMongodb(err , res)
    if (process.env.NODE_ENV == "production") {
        sendToProduction(err , res)
    }
    else {
        sendToDev(err , res)
    }
}