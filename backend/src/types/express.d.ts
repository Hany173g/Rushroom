import express from 'express';
import {Types} from "mongoose"



declare global {
  namespace Express {
    interface Request {
      authUser?: { googleId: string; email: string; name: string , _id : Types.ObjectId } | null;
    }
  }
}