import axios from 'axios';

// 1. INITIALIZE AXIOS INSTANCE
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://e-voting-portal-toln.onrender.com/api',
});

// 2. ATTACH AUTHENTICATION TOKENS AUTOMATICALLY
API.interceptors.request.use((req) => {
  if (req.url.includes('/admin')) {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      req.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    const studentToken = localStorage.getItem('token');
    if (studentToken) {
      req.headers.Authorization = `Bearer ${studentToken}`;
    }
  }
  return req;
});

// Helper for fetching live election results (supports both student and admin tokens)
export const getResults = () => {
  const adminToken = localStorage.getItem('adminToken');
  const endpoint = adminToken ? '/admin/results' : '/voting/results';
  return API.get(endpoint);
};

// 3. DEFAULT EXPORT
export default API;