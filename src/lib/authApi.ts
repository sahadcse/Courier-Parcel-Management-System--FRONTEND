// src/lib/authApi.ts
import api from './axios';
import { LoginInput, RegisterInput, RegisterAdminInput  } from '@/types'; // We'll define these types next

export const loginUser = async (credentials: LoginInput) => {
  const response = await api.post('/auth/login', credentials);
  return response.data; // Should return { success, message, data: { user, token } }
};

export const registerCustomer = async (userData: RegisterInput) => {
  const response = await api.post('/auth/register/customer', userData);
  return response.data; // Should return { success, message, data: { user } }
};

export const registerAdmin = async (adminData: RegisterAdminInput) => {
  const response = await api.post('/auth/register/admin', adminData);
  return response.data;
};


export const registerAgent = async (userData: RegisterInput) => {
  const response = await api.post('/auth/register/agent', userData);
  return response.data;
};