import { Request } from "express";

// --------------------------------------
// User Interface (TypeScript typings)
// --------------------------------------
export interface IUser{
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: "Admin" | "User";
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppError {
  message: string;
}

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    role: string;
  };
}
