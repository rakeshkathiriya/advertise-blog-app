import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { AuthPayload } from './auth.middleware';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as AuthPayload | undefined;

    if (!user) {
      return next(createHttpError.Unauthorized('Unauthorized — You must be logged in to access this resource.'));
    }

    if (user.role !== 'Admin') {
      return next(createHttpError.Forbidden('Access denied — Only administrators can access this resource.'));
    }

    next();
  } catch (error) {
    next(error);
  }
};
