// src/lib/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    id: string | null;
    username: string | null;
    email: string | null;
    role: 'admin' | 'agent' | 'customer' | null;
  };
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {
    id: null,
    username: null,
    email: null,
    role: null,
  },
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        id: string;
        username: string;
        email: string;
        role: 'admin' | 'agent' | 'customer';
        token: string;
      }>,
    ) => {
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearUser: state => {
      state.user = { id: null, username: null, email: null, role: null };
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
