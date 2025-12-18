import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthPayload extends JwtPayload {
  id: string;
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  // Try first from Authorization header (Normal Login)
  let token = req.headers['authorization']?.split(' ')[1] || null;
  // try {
  if (!token) return next(createHttpError.Unauthorized('token is Missing'));

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) return next(createHttpError.InternalServerError('JWT secret missing'));

  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      return next(createHttpError.Unauthorized('Token Expired'));
    }
    req.user = payload;
    next();
  });
};
