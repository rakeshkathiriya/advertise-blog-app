import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '../../utils/axiosFactory';
import { handleErrorResponse, handleResponse } from '../../utils/helper';
import type { CommonApiError, CommonNullResponse } from '../../utils/types/common';
import type { ChangePassValues } from '../../utils/validationSchema/changePassword';

export const useUserChangePassword = () => {
  return useMutation<CommonNullResponse, CommonApiError, ChangePassValues>({
    mutationKey: ['useUserLogin'],
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
