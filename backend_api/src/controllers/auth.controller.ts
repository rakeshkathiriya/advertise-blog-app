import { NextFunction, Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { PassportFacebookResult } from '../utils/types/type';

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

// ******************* Facebook Login ************************

export const facebookCallback = (req: Request, res: Response, next: NextFunction) => {
  const data = req.user as PassportFacebookResult;

  if (!data) return res.redirect(`${process.env.FRONTEND_URL}/login?error=facebook`);

  const email = data.user.email;

  // Normal User
  if (email !== process.env.ADMIN_EMAIL) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/facebook-auth-success?token=${data.token}&user=${encodeURIComponent(
        JSON.stringify(data.user)
      )}`
    );
  }

  // Admin - IMPORTANT: Use exact same redirect_uri as in Meta settings
  const adminPermUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.ADMIN_APP_ID}&redirect_uri=${encodeURIComponent(
    process.env.ADMIN_FB_CALLBACK_URL!
  )}&auth_type=rerequest&scope=email,pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish&response_type=code`;

  return res.redirect(adminPermUrl);
};

export const facebookAdminCallback = (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.user as PassportFacebookResult;

    if (!data) {
      // console.error('No user data from passport');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=admin-auth-failed`);
    }

    // Verify it's the admin
    if (data.user.email !== process.env.ADMIN_EMAIL) {
      // console.log('Unauthorized user tried admin login:', data.user.email);
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    // console.log('Admin login successful:', data.user);

    return res.redirect(
      `${process.env.FRONTEND_URL}/facebook-auth-success?token=${data.token}&user=${encodeURIComponent(
        JSON.stringify(data.user)
      )}`
    );
  } catch (err) {
    console.error('Admin callback error:', err);
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }
};
