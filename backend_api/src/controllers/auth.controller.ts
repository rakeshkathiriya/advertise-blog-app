import { NextFunction, Request, Response } from 'express';
import { changePasswordService, loginUser, registerUser } from '../services/auth.service';
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
  try {
    const data = req.user as PassportFacebookResult;

    if (!data) return res.redirect(`${process.env.FRONTEND_URL}/login?error=facebook`);
    // console.log('Data For Token', data);
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
    // const adminPermUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.ADMIN_APP_ID}&redirect_uri=${encodeURIComponent(
    //   process.env.ADMIN_FB_CALLBACK_URL!
    // )}&auth_type=rerequest&scope=email,pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish&response_type=code`;

    // return res.redirect(adminPermUrl);

    return res.redirect(`${process.env.BACKEND_URL}/aba/auth/facebook/admin`);
  } catch (error) {
    console.error('Admin callback error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }
};

export const facebookAdminCallback = (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.user as PassportFacebookResult;

    if (!data) {
      console.error('No user data from passport');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=admin-auth-failed`);
    }

    // Verify it's the admin
    if (data.user.email !== process.env.ADMIN_EMAIL) {
      // console.log('Unauthorized user tried admin login:', data.user.email);
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    // console.log('Admin login successful:', data.user);
    // console.log(data);
    // console.log('data for facebook accessToken', data.facebookAccessToken);

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

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { confirmPassword, newPassword, currentPassword, email } = req.body;
    await changePasswordService(confirmPassword, newPassword, currentPassword, email);

    res.status(200).json({
      status: true,
      message: 'Password Change Successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
