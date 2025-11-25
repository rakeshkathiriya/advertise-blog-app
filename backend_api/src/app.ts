import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import createHttpError, { HttpError } from 'http-errors';
import morgan from 'morgan';
import { authMiddleware } from './middlewares/auth.middleware';
import { isAdmin } from './middlewares/isAdmin.middleware';
import router from './routes';

// Create express app
const app = express();

// Morgan logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Helmet middleware for security headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data to prevent NoSQL injection
// app.use(ExpressMongoSanitize({allowDots: true}));

// Enable cookie parsing
app.use(cookieParser());

// Enable CORS
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   console.log('📌 Incoming Request:', req.method, req.url);
//   console.log('📌 Headers:', req.headers);
//   next();
// });

app.get('/user', authMiddleware, isAdmin, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not found in request.' });
  }

  res.json({
    message: 'This route is for Admin users only',
    admin: req.user, // shows admin user details
  });
});

app.get('/guest', authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: 'This route is for Guest users',
    user: req.user,
  });
});

// ✅ API v1 route
app.use('/aba', router);

// ✅ 404 handler
app.use((req: Request, res: Response, next: NextFunction): void => {
  next(createHttpError(404, 'This route does not exist.'));
});

// ✅ Global error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction): void => {
  res.status(err.status || 500).json({
    error: {
      statusCode: err.status || 500,
      status: false,
      message: err.message,
    },
  });
});

export default app;
