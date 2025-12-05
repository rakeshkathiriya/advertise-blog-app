import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '../../utils/axiosFactory';
import { handleErrorResponse, handleResponse } from '../../utils/helper';
import type { CommonApiError, CommonNullResponse } from '../../utils/types/common';
import type { ChangePassValues, ResetPasswordPayload } from '../../utils/validationSchema/changePassword';

export const useUserChangePassword = () => {
  return useMutation<CommonNullResponse, CommonApiError, ChangePassValues>({
    mutationKey: ['useUserChangePassword'],
    mutationFn: async (payload: ChangePassValues) => {
      try {
        const response = await api.post<CommonNullResponse>('auth/changePassword', payload);
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};

export const useResetPasswordEmail = () => {
  return useMutation<CommonNullResponse, CommonApiError, { email: string }>({
    mutationKey: ['useUserResetPassword'],
    mutationFn: async (payload: { email: string }) => {
      try {
        const response = await api.post<CommonNullResponse>('auth/resetPassword', payload);
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};

export const useResetPassword = () => {
  return useMutation<CommonNullResponse, CommonApiError, ResetPasswordPayload>({
    mutationKey: ['update-password'],
    mutationFn: async (payload) => {
      const res = await api.post(`auth/updatePassword`, payload);
      return res.data;
    },
  });
};
