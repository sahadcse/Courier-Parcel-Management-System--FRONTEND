// lib/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

export default api;