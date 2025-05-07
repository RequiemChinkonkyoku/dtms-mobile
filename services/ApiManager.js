import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '@env';
// import { API_URL } from '@env';
import { router } from 'expo-router';

const ApiManager = axios.create({
  baseURL: EXPO_PUBLIC_API_URL,
  // baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: status => status >= 200 && status < 300
});

// Add request logging
ApiManager.interceptors.request.use(
  config => {
    console.log('Request URL:', config.baseURL + config.url);
    return config;
  },
  error => Promise.reject(error)
);

ApiManager.interceptors.response.use(
  (response) => response,
  async (error) => {
      console.log('API Error:', {
        url: error.config?.url,
        message: error.message,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
          router.replace('/login');
      }
      return Promise.reject(error);
  }
);

export default ApiManager;