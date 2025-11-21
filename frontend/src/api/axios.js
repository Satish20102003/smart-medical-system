import axios from 'axios';

// Create axios instance pointing to your Backend
const api = axios.create({
  baseURL: 'https://smart-medical-system.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor 1: Add Token to Requests ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Interceptor 2: Handle Errors (Auto Logout) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid/expired, clear it and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;