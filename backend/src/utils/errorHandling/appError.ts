



export interface IAppError {
    isOperational : boolean,
    statusCode : number,
    message : string
}



export class AppError extends Error implements IAppError {
    isOperational : boolean = true;
    statusCode: number
    constructor(message : string ,statusCode : number) {
       super(message)
       this.statusCode = statusCode
       Error.captureStackTrace(this,this.constructor)
    }
}