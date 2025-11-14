import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";
import { IUser } from "../utils/types/type";

export const registerUser = async (data: IUser) => {
  console.log(data);

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
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  // Check user exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError.Unauthorized("Invalid email or password");
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError.Unauthorized("Invalid email or password");
  }

  // Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user };
};
