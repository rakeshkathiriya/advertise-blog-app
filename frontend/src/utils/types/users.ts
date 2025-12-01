import type { CommonResponse } from './common';

export interface UsersDataResponse extends CommonResponse {
  data: UserDetails[];
}

export interface UserDetails {
  _id?: string;
  firstname: string;
  lastname: string;
  email: string;
  isSubscribed: boolean;
  isForeverSubscribe: boolean;
}
