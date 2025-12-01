import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '../../utils/axiosFactory';
import { handleErrorResponse, handleResponse } from '../../utils/helper';
import type { CommonApiError, CommonNullResponse } from '../../utils/types/common';
import type { UsersDataResponse } from '../../utils/types/users';

export const useGetSubScribeUserList = ({
  email,
  isSubscribed,
  isForeverSubscribe,
  page,
}: {
  email: string;
  isSubscribed: string;
  isForeverSubscribe: string;
  page: number;
}) => {
  return useQuery<UsersDataResponse, CommonApiError>({
    queryKey: ['useGetSubScribeUserList', email, isSubscribed, isForeverSubscribe, page],
    queryFn: async () => {
      try {
        const params = {
          ...(email ? { email } : {}),
          isSubscribed,
          isForeverSubscribe,
          page,
        };
        const response = await api.get('/users', { params });
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
    staleTime: 0,
  });
};

export const useChangeForeverSubscribeStatus = () => {
  return useMutation<CommonNullResponse, CommonApiError, { id: string }>({
    mutationKey: ['useChangeForeverSubscribeStatus'],
    mutationFn: async ({ id }: { id: string }) => {
      try {
        const response = await api.patch<CommonNullResponse>(`/users/${id}`);
        return handleResponse(response);
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
  });
};
