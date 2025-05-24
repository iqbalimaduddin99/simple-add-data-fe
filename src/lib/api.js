'use client';

import axios from "axios";
import Router from 'next/router';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  timeout: 10000,
});


api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token'); 
      // Router.push('/login'); 
      window.location.href = '/login';
    } else if (
      error.response?.data?.message === 'Route [login] not defined.'
    ) {
      // Router.push('/login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
