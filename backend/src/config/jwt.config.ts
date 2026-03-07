import jwt, { SignOptions, Algorithm } from "jsonwebtoken";




// Create a config access token and refresh token use algorithm RS256 To more secuirty
export const jwtAccessTokenConfig : SignOptions = {
    algorithm:"HS256"  as Algorithm,
    expiresIn:"1d"
}


export const jwtRefreshTokenConfig : SignOptions = {
    algorithm:"HS256" as Algorithm,
    expiresIn:"7d"
}









