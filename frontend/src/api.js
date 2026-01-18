import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const saveProfile = (data) => API.post('/api/profile', data);
export const getDashboard = () => API.get('/api/dashboard');
export const sendChat = (msg) => API.post('/api/chat', { message: msg });
export const getHistory = () => API.get('/api/history');

export default API;