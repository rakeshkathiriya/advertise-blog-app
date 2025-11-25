// --------------------------------------
// User Interface (TypeScript typings)

import mongoose from 'mongoose';

// --------------------------------------
export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: 'Admin' | 'User';
  facebookId?: string | null;
  facebookAccessToken?: string | null;
  facebookPageId?: string | null;
  instagramBusinessAccountId?: string | null;
  isSubscribed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  fileBuffer: Buffer;
  image?: string;
  description: string;
  uploadOnFacebook: boolean;
  uploadOnInstagram: boolean;
  fbPostId: string;
  igPostId: string;
  client: mongoose.Schema.Types.ObjectId;
}

export interface Client {
  name: string;
  poc: string;
  contact: string;
  email: string;
  expiredDate?: Date | null;
  postLimit: number;
  posts?: mongoose.Types.ObjectId[];
}

export interface ClientUpdate {
  poc: string;
  contact: string;
  email: string;
  expiredDate: Date;
  postLimit: number;
}

export interface FacebookLoginPayload {
  firstname: string;
  lastname: string;
  email?: string;
  facebookId: string;
  facebookAccessToken: string | null;
  facebookPageId: string | null;
  instagramBusinessAccountId: string | null;
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

export interface PassportFacebookResult {
  user: IUser;
  token: string;
  facebookAccessToken: string;
}
