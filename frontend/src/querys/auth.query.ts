import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '../utils/axiosFactory';
import { cleanPayload, handleErrorResponse, handleResponse } from '../utils/helper';
import type { RegisterUserPayload } from '../utils/types/auth';
import type { CommonApiError, CommonNullResponse } from '../utils/types/common';

export const useUserRegistration = () => {
  return useMutation<CommonNullResponse, CommonApiError, RegisterUserPayload>({
    mutationKey: ['useUserRegistration'],
    mutationFn: async (payload: RegisterUserPayload) => {
      try {
        const cleanedPayload = cleanPayload(payload);
        const response = await api.post<CommonNullResponse>('/auth/register', cleanedPayload);
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};

export const useUserLogin = () => {
  return useMutation<CommonNullResponse, CommonApiError, { email: string; password: string }>({
    mutationKey: ['useUserLogin'],
    mutationFn: async (payload: { email: string; password: string }) => {
      try {
        const cleanedPayload = cleanPayload(payload);
        const response = await api.post<CommonNullResponse>('/auth/login', cleanedPayload);
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};

export const useUserLogout = () => {
  return useMutation<CommonNullResponse, CommonApiError, void>({
    mutationKey: ['useUserLogout'],
    mutationFn: async () => {
      try {
        const response = await api.post<CommonNullResponse>('/auth/logout');
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};
