import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '../../utils/axiosFactory';
import { cleanPayload, handleErrorResponse, handleResponse } from '../../utils/helper';
import type { ClientsDataResponse, CreateClientPayload } from '../../utils/types/clients';
import type { CommonApiError, CommonNullResponse } from '../../utils/types/common';
import type { ClientDDResponse } from '../../utils/types/post';

export const useClientsDDOptions = () => {
  return useQuery<ClientDDResponse, CommonApiError>({
    queryKey: ['useClientsDDOptions'],
    queryFn: async () => {
      try {
        const response = await api.get('clients/dropdown');
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

export const useUpdateClient = () => {
  return useMutation<CommonNullResponse, CommonApiError, CreateClientPayload>({
    mutationKey: ['useUpdateClient'],
    mutationFn: async (payload: CreateClientPayload) => {
      try {
        const cleanedPayload = cleanPayload(payload);
        const response = await api.patch<CommonNullResponse>(`/clients/${payload.id}`, cleanedPayload);
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};

export const useDeleteClient = () => {
  return useMutation<CommonNullResponse, CommonApiError, { id: string }>({
    mutationKey: ['useDeleteClient'],
    mutationFn: async (payload: { id: string }) => {
      try {
        const response = await api.delete<CommonNullResponse>(`/clients/${payload.id}`);
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};

export const useGetClientsList = ({ name, status, page }: { name: string; status: string; page: number }) => {
  return useQuery<ClientsDataResponse, CommonApiError>({
    queryKey: ['useGetClientsList', name, status, page],
    queryFn: async () => {
      try {
        const params = {
          ...(name ? { name } : {}),
          ...(status && status !== 'all' ? { status } : {}),
          page,
        };
        const response = await api.get('/clients', { params });
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
