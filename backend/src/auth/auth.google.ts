import dotenv from "dotenv"
import passport from "passport"
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20"
import { Request } from "express";

import {payloadType} from "../types/auth.types.js"

dotenv.config()

// Google passport config and create User
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "test",
    clientSecret: process.env.GOOGLE_CLIENT_SECERT || "test",
    callbackURL: process.env.GOOGLE_CALL_BACK_URL || "test",
    passReqToCallback: true
}, (_req: Request, _accessToken: string, _refreshToken: string, profile: Profile, done: any) => {
    
    type payloadTypeWithoutId = Omit<payloadType, "_id">;
    let payload : payloadTypeWithoutId  = {
        name : profile.displayName.slice(0 , 25),
        email :  profile.emails?.[0]?.value || "",
        googleId:profile.id,
        
    }
    done(null, payload)
}))

