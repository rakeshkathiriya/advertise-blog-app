import mongoose, { Schema } from 'mongoose';
import { IUser } from '../utils/types/type';

// --------------------------------------
// Mongoose Schema
// --------------------------------------

const userSchema: Schema<IUser> = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      trim: true,
      minLength: [8, 'Password must be at least 8 characters long'],
      maxLength: [64, 'Password cannot exceed 64 characters'],
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookAccessToken: {
      type: String,
    },
    facebookPageId: {
      type: String,
    },
    instagramBusinessAccountId: {
      type: String,
    },
  },
  { timestamps: true }
);

// --------------------------------------
// Model Export
// --------------------------------------
export const UserModel = mongoose.model<IUser>('User', userSchema);
