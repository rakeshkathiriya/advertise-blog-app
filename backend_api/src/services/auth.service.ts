import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";
import { IUser } from "../utils/types/type";

// ******************* Register ************************
export const registerUser = async (data: IUser) => {
  //check if fields are empty
  if(!data.firstname || !data.lastname || !data.email || !data.password){
    throw createHttpError.BadRequest("All fields are required");
  }

  // Check if email already exists
  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw createHttpError.Conflict("User already exists with this email");
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
  if(!email || !password){
    throw createHttpError.BadRequest("All fields are required");
  }

  const normalizedEmail = email.toLowerCase();
    
  // Check user exists
  const user = await UserModel.findOne({ email: normalizedEmail }).lean().select("+password");

  //check if user exist
  if (!user) {
    throw createHttpError.NotFound("No account with this email has been registered.");
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw createHttpError.NotFound("Invalid credentials.");

  // Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user };
};
