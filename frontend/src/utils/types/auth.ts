import type { CommonResponse } from './common';

export interface RegisterUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'User' | 'Admin';
  isActive?: boolean;
}

export interface LoginUserResponse extends CommonResponse {
  data: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: 'Admin' | 'User';
    isActive: boolean;
  };
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface UserData {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'Admin' | 'User';
  expireAt?: number;
  loginType?: string | undefined;
}

export interface AuthState {
  user: UserData | null;
}

export interface DecodedToken {
  id: string;
  role: string;
  isForeverSubscribe: boolean;
  exp?: number;
}
