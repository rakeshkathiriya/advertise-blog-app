import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleErrorResponse } from '../../utils/helper';
import type { BloggerPost, BloggerResponse } from '../../utils/types/blog';
import type { CommonApiError } from '../../utils/types/common';

const blogId = import.meta.env.VITE_BLOGGER_ID;
const key = import.meta.env.VITE_BLOGGER_API_KEY;

export const useGetAllBlogs = () => {
  return useQuery<BloggerResponse, CommonApiError>({
    queryKey: ['useGetAllBlogs'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?labels=FoodNProcessing&key=${key}`,
        );

        const mappedItems: BloggerPost[] =
          response?.data?.items?.map((post: any) => ({
            id: post.id,
            title: post.title ?? '',
            content: post.content ?? '',
            url: post.url ?? '',
          })) ?? [];

        return { items: mappedItems };
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetParticularBlog = (id: string) => {
  return useQuery<BloggerResponse, CommonApiError>({
    queryKey: ['useGetParticularBlog', id],
    enabled: !!id,
    queryFn: async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${id}?key=${key}`,
        );
        // transform into your simplified type
        const post = response.data;

        const mappedPost = {
          id: post.id,
          title: post.title ?? '',
          content: post.content ?? '',
          url: post.url ?? '',
        };
        return { items: [mappedPost] };
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetLatestBlog = (id: string) => {
  return useQuery<BloggerResponse, CommonApiError>({
    queryKey: ['useGetLatestBlog', id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?maxResults=5&key=${key}`,
        );

        const allPosts = response.data.items || [];

        // remove current blog
        const filteredPosts = allPosts.filter((p: any) => p.id !== id);

        // map all posts into simplified structure
        const mappedPosts = filteredPosts.map((p: any) => ({
          id: p.id,
          title: p.title ?? '',
          content: p.content ?? '',
          url: p.url ?? '',
          published: p.published ?? null,
        }));

        return { items: mappedPosts };
      } catch (error) {
        if (axios.isAxiosError(error)) throw handleErrorResponse(error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
  });
};
