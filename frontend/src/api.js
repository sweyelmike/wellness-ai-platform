import axios from 'axios';

// 1. Point to your LIVE Backend (Render)
const API = axios.create({
  baseURL: 'https://wellness-ai-platform.onrender.com',
});

// 2. Automatically add the Token to every request (if logged in)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// 3. Define all your API calls here
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getDashboard = () => API.get('/api/dashboard');
export const saveProfile = (data) => API.post('/api/profile', data);
export const chatWithAI = (message) => API.post('/api/chat', { message });
export const getChatHistory = () => API.get('/api/history');

export default API;