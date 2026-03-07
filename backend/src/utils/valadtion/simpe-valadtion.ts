import { AppError } from "../errorHandling/appError.js";




















export function checkIsVaribleHaveAValue(value : any) {
    if (!value) {
        throw new AppError("لم يتم ارسال شي" , 400)
    }
}