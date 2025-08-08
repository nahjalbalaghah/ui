import axios from 'axios';

const API_BASE_URL = 'https://test-admin.nahjalbalaghah.org/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Request params:', config.params);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.statusText);
    console.error('API Error Details:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
