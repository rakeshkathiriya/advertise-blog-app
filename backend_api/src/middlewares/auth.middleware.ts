import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";

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
  const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  try {
    // No token → unauthorized
    if (!token) return next(createHttpError.Unauthorized());

    // Secret key required
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) return next(createHttpError.InternalServerError());

    const {err, decoded} = jwt.verify(token, secret) as AuthPayload;
    
    if (err) return next(createHttpError.Unauthorized());
    // Attach user to req
    req.user = decoded;
    next();
  } catch (error: unknown) {
    next(error);
  }
};
