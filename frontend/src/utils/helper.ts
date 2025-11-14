import type { AxiosResponse } from 'axios';
import { HTTP_OK, HTTP_OK_2 } from './constants';
import type { ApiErrorResponse, CommonApiError } from './types/common';

export const cleanPayload = <T extends object>(payload: T, clearEmpty: boolean = false): Partial<T> => {
  return Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => {
      if (!clearEmpty) return value !== '' && value !== null && value !== undefined;

      if (value === '' || value === null || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
      return true;
    }),
  ) as Partial<T>;
};

export const handleErrorResponse = <T = null>(error: CommonApiError): ApiErrorResponse<T> => {
  const errorData = error.response?.data;
  const errors = error?.response?.data?.errors;

  return {
    message: errorData?.message ?? 'Unknown error occurred',
    status: false,
    data: (errorData?.data ?? null) as T,
    errors,
  };
};

export const handleResponse = async <T>(
  response: AxiosResponse<{
    data: T;
    message: string;
    status: boolean;
  }>,
): Promise<{
  data: T;
  message: string;
  status: boolean;
}> => {
  // Check for error status
  if (![HTTP_OK, HTTP_OK_2].includes(response.status)) {
    return {
      message: response.data?.message ?? 'Unknown error occurred',
      status: false,
      data: response.data?.data,
    };
  }

  return response.data;
};
