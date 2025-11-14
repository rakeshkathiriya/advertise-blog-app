import { NextFunction, Request, Response } from "express";
import logger from "../configs/logger.config";
import { loginUser, registerUser } from "../services/auth.service";
import { AppError } from "../utils/types/type";

export const register = async (req: Request, res: Response,next:NextFunction) => {
  try {
    console.log(req.body);
    const user = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
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

export const login = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);
    const data = await loginUser(email, password);

    // Set cookie
    res.cookie("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: data.user,
    });
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

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
