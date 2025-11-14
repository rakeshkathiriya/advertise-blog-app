import type { AxiosError } from 'axios';

export interface CommonNullResponse extends CommonResponse {
  data: null;
}

export interface CommonResponse {
  status: boolean;
  message: string;
}

export type CommonApiError<T = unknown> = AxiosError<{
  message: string | string[];
  error: string;
  statusCode: number;
  data?: T;
  errors?: string[];
}>;

export interface ApiErrorResponse<T = null> {
  status: boolean;
  message: string | string[];
  errors?: string[] | [];
  data: T | null;
}
