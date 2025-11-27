import type { CommonResponse } from './common';

export interface AdvertisePayload {
  image: File | null;
  description: string;
  uploadOnFacebook: boolean;
  uploadOnInstagram: boolean;
  client: string;
}

export interface AdvertiseResponse extends CommonResponse {
  data: Advertise[];
}

export interface Advertise {
  _id: string;
  image: string;
  description: string;
  uploadOnFacebook: boolean;
  uploadOnInstagram: boolean;
  fbPostId: string | null;
  igPostId: string | null;
  client: AdvertiseClient;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdvertiseClient {
  _id: string;
  name: string;
  poc: string;
  contact: string;
  postLimit: number;
  email: string;
  expiredDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  posts: string[];
}

export interface ClientDDResponse extends CommonResponse {
  data: ClientDD[];
}

export interface ClientDD {
  _id: string;
  name: string;
}
