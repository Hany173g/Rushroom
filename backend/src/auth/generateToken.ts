import jwt from "jsonwebtoken"
import {jwtAccessTokenConfig} from "../config/jwt.config.js"
import {payloadType }  from "../types/auth.types.js"






// Create a access token 1h expired
export function generateAccessToken(payload : payloadType) {
    let token = jwt.sign(payload,process.env.ACCESS_TOKEN as string , jwtAccessTokenConfig)
    return token
}