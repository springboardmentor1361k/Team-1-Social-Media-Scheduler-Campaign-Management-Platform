import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Authorization Bearer token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch auth errors (e.g. expired tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns a 401 Unauthorized, automatically log out
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized API call detected - clearing token");
      localStorage.removeItem('token');
      // Optional: window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
