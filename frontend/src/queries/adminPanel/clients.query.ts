import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '../../utils/axiosFactory';
import { cleanPayload, handleErrorResponse, handleResponse } from '../../utils/helper';
import type { ClientsDataResponse, CreateClientPayload } from '../../utils/types/clients';
import type { CommonApiError, CommonNullResponse } from '../../utils/types/common';

export const useCreateClient = () => {
  return useMutation<CommonNullResponse, CommonApiError, CreateClientPayload>({
    mutationKey: ['useCreateClient'],
    mutationFn: async (payload: CreateClientPayload) => {
      try {
        const cleanedPayload = cleanPayload(payload);
        const response = await api.post<CommonNullResponse>('/clients', cleanedPayload);
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};

export const useGetClientsList = () => {
  return useQuery<ClientsDataResponse, CommonApiError>({
    queryKey: ['useGetClientsList'],
    queryFn: async () => {
      try {
        const response = await api.get('/clients');
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
