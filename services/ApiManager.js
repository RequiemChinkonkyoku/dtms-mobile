import axios from 'axios';
import { API_URL } from '@env';
import { router } from 'expo-router';

const ApiManager = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

ApiManager.interceptors.response.use(
  (response) => response,
  async (error) => {
      if (error.response?.status === 401) {
          // Handle token expiration
          // You could implement token refresh here
          // For now, redirect to login
          router.replace('/login');
      }
      return Promise.reject(error);
  }
);

export default ApiManager;