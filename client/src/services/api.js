import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const loginUser = (data) => API.post('/login', data);
export const registerPatient = (data) => API.post('/register', data);
export const getProfile = () => API.get('/profile');
