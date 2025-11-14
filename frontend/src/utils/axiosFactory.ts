import axios from 'axios';

import type { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/aba/',
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    console.log('Request Sent To:', config.url);
    return config;
  },
  (error) => {
    console.error(' Request Error:', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(' Response Received:', response.status);
    return response;
  },
  (error) => {
    console.error(' Request Error:', error);
    return Promise.reject(error);
  },
);

export { api };
