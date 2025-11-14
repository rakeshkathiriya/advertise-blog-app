import { NextFunction, Request, Response } from "express";
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
  
  // User must be logged in first
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Login first to access this resource",
    });
  }
  
  // Check Admin role
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden — Only Admins can access this resource",
    });
  }
  next();
};
