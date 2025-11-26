import type { CommonResponse } from './common';

export interface CreateClientPayload {
  name: string;
  poc: string;
  email: string;
  contact: string;
  postLimit: number;
  expiredDate: Date;
}

export interface Client {
  name: string;
  poc: string;
  email: string;
  postLimit: string;
  expiredDate: string;
  contact: string;
}

export interface ClientsDataResponse extends CommonResponse {
  data: ClientDetails[];
}

export interface ClientDetails {
  _id: string;
  name: string;
  poc: string;
  contact: string;
  postLimit: number;
  email: string;
  expiredDate: string; // or Date if you convert it
  posts: any[]; // you can define a proper type if posts have structure
  createdAt: string; // or Date
  updatedAt: string; // or Date
  __v: number;
}
