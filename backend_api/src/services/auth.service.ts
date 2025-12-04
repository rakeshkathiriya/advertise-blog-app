import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
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

  // ❗ Use findOne instead of find (find returns an array)
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError.NotFound('User not found');
  }

  // 🛑 Validate old password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw createHttpError.BadRequest('Current password is incorrect');
  }

  // 🛑 Ensure new password is not the same as old password
  if (currentPassword === newPassword) {
    throw createHttpError.BadRequest('New password cannot be the same as the current password');
  }

  // 🛑 Validate new + confirm password
  if (newPassword !== confirmPassword) {
    throw createHttpError.BadRequest('New password and confirm password do not match');
  }

  // 🔐 Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 💾 Save to DB
  user.password = hashedPassword;
  await user.save();

  return user;
};
