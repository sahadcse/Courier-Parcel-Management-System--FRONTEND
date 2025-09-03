// src/lib/adminSlice.ts
import api from './api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { isApiError, AnalyticsData } from '@/types';
import { fetchAllUsers as fetchAllUsersApi } from './adminApi';

// Define a simple user type for the agent/user list
export interface User {
  _id: string;
  customerName: string | null;
  email: string | null;
  role: 'admin' | 'agent' | 'customer' | null;
  isActive: boolean;
  address: string | null;
  phone: string | null;
}

interface AdminState {
  users: User[];
  reports: AnalyticsData | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: AdminState = {
  users: [],
  reports: null,
  loading: 'idle',
};

// Thunk to fetch analytics data
export const fetchAnalyticsData = createAsyncThunk(
  'admin/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await import('@/lib/api').then(mod => mod.default.get('/admin/analytics'));
      return response.data.data;
    } catch (error: unknown) {
      if (isApiError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('Failed to fetch analytics');
    }
  },
);

// Thunk to fetch all agents (users)
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await fetchAllUsersApi();
      return users;
    } catch (error: unknown) {
      if (isApiError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('Failed to fetch users');
    }
  },
);

// Thunk to update agent's active status
export const updateAgentStatus = createAsyncThunk(
  'admin/updateAgentStatus',
  async ({ agentId, isActive }: { agentId: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/agent/status/${agentId}`, { isActive });
      return response.data.data;
    } catch (error: unknown) {
      if (isApiError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('Failed to update status');
    }
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // This case now handles fetching all users
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(fetchAllUsers.pending, state => {
        state.loading = 'pending';
      })
      .addCase(updateAgentStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // 5. Add cases for the new thunk
      .addCase(fetchAnalyticsData.pending, state => {
        state.loading = 'pending';
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action: PayloadAction<AnalyticsData>) => {
        state.reports = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(fetchAnalyticsData.rejected, state => {
        state.loading = 'failed';
      });
  },
});

export default adminSlice.reducer;
