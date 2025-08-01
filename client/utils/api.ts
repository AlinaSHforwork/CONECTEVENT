// client/utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL:  'https://eventhub-api-v6cw.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure config.headers is an object
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor for global error handling (e.g., token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: If token expires (401 Unauthorized), redirect to login
    if (error.response && error.response.status === 401) {
      // You'll implement a proper redirect later with Next.js router
      console.log('Unauthorized request. Token might be expired or invalid.');
      // You might clear the token and redirect to login page here.
      localStorage.removeItem('token');
      // window.location.href = '/login'; // This would be a client-side redirect
    }
    return Promise.reject(error);
  }
);

export default api;
