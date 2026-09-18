import axios from 'axios';

// Create an Axios instance pointing to your Express backend
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Automatically attach the JWT token to requests if the student is logged in
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const loginStudent = (usn, year, section) => API.post('/auth/login', { usn, year, section });
export const getBallot = () => API.get('/voting/ballot');
export const submitVote = (selectedCandidateIds) => API.post('/voting/submit', { selectedCandidateIds });
export const getResults = () => API.get('/voting/results');