import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { resetPasswordTemplate } from '../configs/resetPasswordTemplate';
import { UsedToken } from '../models/usedTokenModel';
import { UserModel } from '../models/userModel';
import { FacebookLoginPayload, IUser } from '../utils/types/type';

const adminEmail = process.env.ADMIN_EMAIL;
const jwtSecret = process.env.ACCESS_TOKEN_SECRET as string;
// ******************* Register ************************
export const registerUser = async (data: IUser) => {
  //check if fields are empty
  if (!data.firstname || !data.lastname || !data.email || !data.password) {
    throw createHttpError.BadRequest('Required fields missing');
  }

  // Check if email already exists
  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw createHttpError.Conflict('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create new user
  const user = await UserModel.create({
    ...data,
    email: data.email.toLowerCase(),
    password: hashedPassword,
  });

  return user;
};

// ******************* Login ************************
export const loginUser = async (email: string, password: string) => {
  //check if fields are empty
  if (!email || !password) {
    throw createHttpError.BadRequest('Required fields missing');
  }

  const normalizedEmail = email.toLowerCase();

  // Check user exists
  const user = await UserModel.findOne({ email: normalizedEmail }).lean().select('+password');

  //check if user exist
  if (!user) {
    throw createHttpError.NotFound('Account not found');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw createHttpError.NotFound('Invalid credentials.');

  // Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role, isForeverSubscribe: user.isForeverSubscribe },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '1d' }
  );

  return { token, user };
};

/**
 * Handle Facebook Login
 */

export async function handleFacebookLogin(payload: FacebookLoginPayload) {
  const { firstname, lastname, email, facebookId, facebookAccessToken, facebookPageId, instagramBusinessAccountId } =
    payload;

  if (!email) {
    throw createHttpError.BadRequest('Email Is Required For Facebook Login');
  }
  // 1️⃣ Determine role
  const role = email === adminEmail ? 'Admin' : 'User';
  // console.log('FaceBook Page Id In S Auth Service ', facebookPageId);
  // console.log('FaceBook Page Id In S Auth Service ', instagramBusinessAccountId);

  // 2️⃣ Try find user by Facebook ID or email
  let user = await UserModel.findOne({
    $or: [{ facebookId }, { email }],
  });

  if (user) {
    // 3️⃣ Update existing FB user
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.facebookId = facebookId;
    user.facebookAccessToken = facebookAccessToken;
    user.facebookPageId = facebookPageId;
    user.instagramBusinessAccountId = instagramBusinessAccountId;
    user.role = role;
    user.isForeverSubscribe = role === 'Admin' ? true : user.isForeverSubscribe;
    await user.save();
  } else {
    // 4️⃣ Create new FB user
    user = await UserModel.create({
      firstname,
      lastname,
      email,
      facebookId,
      facebookAccessToken,
      facebookPageId,
      instagramBusinessAccountId,
      role,
      isForeverSubscribe: role === 'Admin',
    });
  }

  // 5️⃣ Create JWT
  const token = jwt.sign(
    { userId: user._id, role: user.role, isForeverSubscribe: user.isForeverSubscribe },
    jwtSecret,
    { expiresIn: '1d' }
  );

  return { user, facebookAccessToken, token };
}

export const changePasswordService = async (
  confirmPassword: string,
  newPassword: string,
  currentPassword: string,
  email: string
) => {
  if (!confirmPassword || !newPassword || !currentPassword || !email) {
    throw createHttpError.BadRequest('Required fields missing');
  }

  // Use findOne instead of find (find returns an array)
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError.NotFound('No account found with this email.');
  }

  //  Validate old password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw createHttpError.BadRequest('The current password you entered is wrong.');
  }

  //  Ensure new password is not the same as old password
  if (currentPassword === newPassword) {
    throw createHttpError.BadRequest('You can’t reuse your current password.');
  }

  //  Validate new + confirm password
  if (newPassword !== confirmPassword) {
    throw createHttpError.BadRequest('New password and confirm password don’t match.');
  }

  //  Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  //  Save to DB
  user.password = hashedPassword;
  await user.save();

  return user;
};

export const forgotPasswordService = async (email: string) => {
  if (!email) throw createHttpError.BadRequest('Required fields missing');

  const user = await UserModel.findOne({ email });
  if (!user) throw createHttpError.NotFound('No account found with this email.');

  if (user.facebookAccessToken) throw createHttpError.NotFound('You signed up with SOS for this account.');

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '5m',
  });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}&id=${user._id}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request',
    html: resetPasswordTemplate(resetURL),
  };

  await transporter.sendMail(mailOptions);

  return { message: 'Reset link sent! Check your inbox.' };
};

export const updatePasswordService = async (token: string, userId: string, newPassword: string) => {
  if (!token || !userId || !newPassword) throw createHttpError.BadRequest('Missing required fields');
  let decoded: any;

  const existing = await UsedToken.findOne({ token });
  if (existing) throw createHttpError.BadRequest('Link already used. Request a new link.');

  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.NotFound('No account found with this email.');

  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw createHttpError.BadRequest('Link expired. Request a new link.');
    }
    throw createHttpError.BadRequest('This link can’t be used. Get a new one.');
  }

  if (decoded.id !== userId) {
    throw createHttpError.Unauthorized('This reset link isn’t valid for your account.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();
  await UsedToken.create({ token });
  return {
    message: 'Password updated successfully',
  };
};
