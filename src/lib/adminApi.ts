import api from './api';

// This function will fetch all users for the admin
export const fetchAllUsers = async () => {
  const response = await api.get('/admin/all');
  return response.data.data;
};