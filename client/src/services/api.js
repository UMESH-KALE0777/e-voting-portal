import axios from 'axios';

// 1. INITIALIZE FIRST
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://e-voting-portal-toln.onrender.com/api',
});

// 2. ADD INTERCEPTORS SECOND
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

// 3. EXPORT LAST
export default API;