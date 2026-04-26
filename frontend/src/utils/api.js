import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

// Injeta o token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redireciona para login se o token expirar
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/silva-admin')) {
      localStorage.removeItem('admin_token');
      window.location.href = '/silva-admin/login';
    }
    if (err.response?.status === 403 && window.location.pathname.startsWith('/silva-admin')) {
      localStorage.removeItem('admin_token');
      window.location.href = '/silva-admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
