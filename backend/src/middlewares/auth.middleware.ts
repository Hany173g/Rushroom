import passport from "passport";

import type { Request, Response, NextFunction } from "express";

export function authGoogleMiddleware(req: Request, res: Response, next: NextFunction) {
  return passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next)
}

export function authGoogleCallBackMiddleware(req: Request, res: Response, next: NextFunction) {
  return passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  })(req, res, next)
}