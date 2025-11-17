import { NextFunction, Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';

// ******************* Register ************************
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Create new User
    await registerUser(req.body);

    res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: null,
    });
  } catch (error: unknown) {
    next(error);
  }
};

// ******************* Login ************************
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Login user
    const { token, user } = await loginUser(email, password);
    const { password: _, ...userWithoutPassword } = user;

    // Set cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // HTTPS only in production
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    res.status(200).json({
      status: true,
      message: 'Login successful',
      accessToken: token,
      data: userWithoutPassword,
    });
  } catch (error: unknown) {
    next(error);
  }
};

// ******************* Logout ************************
export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      status: true,
      message: 'Logged out successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
