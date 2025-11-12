import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import createHttpError, { HttpError } from "http-errors";
import morgan from "morgan";

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Morgan logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Helmet middleware for security headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data to prevent NoSQL injection
app.use(mongoSanitize());

// Enable cookie parsing
app.use(cookieParser());

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://mern-test-repo.onrender.com",
    ],
    credentials: true,
  })
);

// ✅ API v1 route
app.get("/", (req: Request, res: Response): void => {
  res.status(200).json({ message: "Server running fine 🚀" });
});

// ✅ 404 handler
app.use((req: Request, res: Response, next: NextFunction): void => {
  next(createHttpError(404, "This route does not exist."));
});

// ✅ Global error handler
app.use(
  (err: HttpError, req: Request, res: Response, next: NextFunction): void => {
    res.status(err.status || 500).json({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  }
);

export default app;
