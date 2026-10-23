import axios from 'axios';
const base = import.meta.env.VITE_API_URL || '';
const api = axios.create({ baseURL: base + '/api' });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export const imgUrl = (p) => (p ? (p.startsWith('http') ? p : base + p) : '');
export const errMsg = (e) => e.response?.data?.message || 'Something went wrong. Please try again.';
export default api;
