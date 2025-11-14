import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/types/type";

export interface AuthPayload extends JwtPayload {
  id: string;
  role: string;
}


export interface RequestWithUser extends Request {
  user?: AuthPayload;
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Response | void => {
  
  const token = req.cookies?.token;
  try {
    // Get token from cookie
    // const token = req.cookies?.token;

    // No token → unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login first to access this resource",
      });
    }

    // Secret key required
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "ACCESS_TOKEN_SECRET is missing in env variables",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, secret) as AuthPayload;

    // Attach user to req
    req.user = decoded;

    // Continue
    next();
  } catch (error: unknown) {
   const appError: AppError =
    error instanceof Error
      ? { message: error.message }
      : { message: "Something went wrong" };

  return res.status(400).json({
    success: false,
    message: appError.message,
  });
  }
};
