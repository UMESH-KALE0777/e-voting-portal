import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
});

// Smart interceptor that attaches the correct token based on the route
API.interceptors.request.use((req) => {
  // If the request is going to an admin route, use the admin token
  if (req.url.includes('/admin')) {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      req.headers.Authorization = `Bearer ${adminToken}`;
    }
  } 
  // Otherwise, use the student token
  else {
    const studentToken = localStorage.getItem('token');
    if (studentToken) {
      req.headers.Authorization = `Bearer ${studentToken}`;
    }
  }
  return req;
});

// Student Routes
export const loginStudent = (usn, year, section) => API.post('/auth/login', { usn, year, section });
export const getBallot = () => API.get('/voting/ballot');
export const submitVote = (selectedCandidateIds) => API.post('/voting/submit', { selectedCandidateIds });

// Admin Routes
export const loginAdmin = (username, password) => API.post('/admin/login', { username, password });
export const resetElection = () => API.delete('/admin/reset');

// Note the route change for results: it is now under the admin shield
export const getResults = () => API.get('/admin/results'); 

// Special endpoint for FormData (file uploads)
export const addCandidate = (formData) => API.post('/admin/candidate', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});