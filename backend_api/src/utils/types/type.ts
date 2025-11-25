// --------------------------------------
// User Interface (TypeScript typings)
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
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  image: string;
  description: string;
  uploadOnFacebook: boolean;
  uploadOnInstagram: boolean;
  fbPostId: string;
  igPostId: string;
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
