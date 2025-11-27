import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '../../utils/axiosFactory';
import { handleErrorResponse, handleResponse } from '../../utils/helper';
import type { CommonApiError, CommonNullResponse } from '../../utils/types/common';
import type { AdvertiseResponse } from '../../utils/types/post';

export const advertiseCreation = () => {
  return useMutation<CommonNullResponse, CommonApiError, FormData>({
    mutationKey: ['advertiseCreation'],
    mutationFn: async (formData: FormData) => {
      try {
        const response = await api.post<CommonNullResponse>('admin/advertisements', formData, {
          timeout: 40000,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};

export const useGetAllAdvertise = () => {
  return useQuery<AdvertiseResponse, CommonApiError>({
    queryKey: ['useGetAllAdvertise'],
    queryFn: async () => {
      try {
        const response = await api.get('admin/advertisements');
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useDeleteAdvertise = () => {
  return useMutation<CommonNullResponse, CommonApiError, string>({
    mutationKey: ['useDeleteAdvertise'],
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete<CommonNullResponse>(`admin/${id}/advertisements`);
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};
