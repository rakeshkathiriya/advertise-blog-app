import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { JwtPayload } from "jsonwebtoken";

 export interface AuthPayload extends JwtPayload {
   id: string;
   role: string;
 }
 export interface RequestWithUser extends Request {
   user?: AuthPayload;
 }
 
export const isAdmin = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Response | void => {
  try {
    // User must be logged in
    if (!req.user) return next(createHttpError.Unauthorized("Unauthorized — You must be logged in to access this resource."))
    
    // Check admin role
    if (req.user.role !== "Admin") {
      return next(
        createHttpError.Forbidden(
          "Access denied — Only administrators can access this resource."
        )
      );
    }

    // Success → allow request
    next();
  } catch (error: unknown) {
    next(error);
  }  
};
