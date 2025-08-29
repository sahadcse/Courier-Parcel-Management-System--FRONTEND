// src/lib/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerCustomer } from './authApi';
import { LoginInput, RegisterInput, isApiError } from '@/types';
import api from './axios';
import { registerAdmin as registerAdminApi, registerAgent as registerAgentApi } from './authApi';
import { RegisterAdminInput } from '@/types';
import { User } from './adminSlice';

interface AuthState {
  user: {
    _id: string | null;
    customerName: string | null;
    email: string | null;
    role: 'admin' | 'agent' | 'customer' | null;
    isActive?: boolean;
    address: string | null;
    phone: string | null;
  };
  isAuthenticated: boolean;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: { _id: null, customerName: null, email: null, role: null, isActive: false, address: null, phone: null },
  isAuthenticated: false,
  loading: 'idle',
  error: null,
};

// Async thunk for user login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginInput, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      return response.data; // The { user, token } object
    } catch (error: unknown) {
      // Step 1: Type error as unknown
      if (isApiError(error)) {
        // Step 2: Use the type guard
        // Step 3: Safely access the message
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
});

// New thunk to check auth status on app load
export const verifyAuth = createAsyncThunk('auth/verify', async (_, { rejectWithValue }) => {
  try {
    // This endpoint should return the user if the cookie is valid
    const response = await api.get('/auth/me');
    return response.data.data.user;
  } catch (error: unknown) {
    if (isApiError(error)) return rejectWithValue(error.response?.data?.message);
    return rejectWithValue('Session invalid');
  }
});

// Async thunk for customer registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterInput, { rejectWithValue }) => {
    try {
      // This thunk only registers, it does not log the user in automatically
      const response = await registerCustomer(userData);
      return response.message; // Return success message
    } catch (error: unknown) {
      // Step 1: Type error as unknown
      if (isApiError(error)) {
        // Step 2: Use the type guard
        // Step 3: Safely access the message
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

// New thunk for creating an agent
export const registerAgent = createAsyncThunk(
  'auth/registerAgent',
  async (userData: RegisterInput, { rejectWithValue }) => {
    try {
      const response = await registerAgentApi(userData);
      return response.message;
    } catch (error: unknown) {
      if (isApiError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Agent registration failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// New thunk for creating an admin
export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (adminData: RegisterAdminInput, { rejectWithValue }) => {
    try {
      const response = await registerAdminApi(adminData);
      console.log("Admin Response", response)
      return response.message; // Returns a success message
    } catch (error: unknown) {
      if (isApiError(error)) {
        console.log("Error", error)
        return rejectWithValue(error.response?.data?.message || 'Admin registration failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserStatus: (state, action: PayloadAction<User>) => {
      // Check if the update is for the currently logged-in user
      if (state.user && state.user._id === action.payload._id) {
        state.user.isActive = action.payload.isActive;
        // Also update the copy in localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...storedUser, isActive: action.payload.isActive };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
    // setUser: (
    //   state,
    //   action: PayloadAction<{
    //     id: string;
    //     customerName: string;
    //     email: string;
    //     role: 'admin' | 'agent' | 'customer';
    //     token: string;
    //     address: string;
    //     phone: string;
    //   }>,
    // ) => {
    //   state.user = {
    //     _id: action.payload.id,
    //     customerName: action.payload.customerName,
    //     email: action.payload.email,
    //     role: action.payload.role,
    //     address: action.payload.address,
    //     phone: action.payload.phone,
    //   };
    //   state.isAuthenticated = true;
    // },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload; // Just set the whole user object
      state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    builder
      // Login actions
      .addCase(login.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loading = 'succeeded';
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = 'pending';
      })  
      .addCase(logoutUser.fulfilled, state => {
        state.isAuthenticated = false;
        state.user = { _id: null, customerName: null, email: null, role: null, address: null, phone: null };
        state.loading = 'succeeded';
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = 'failed';
        state.isAuthenticated = false;
        state.user = { _id: null, customerName: null, email: null, role: null, address: null, phone: null };
      })


      // Verify Auth on App Load
      .addCase(verifyAuth.pending, state => {
        state.loading = 'pending';
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(verifyAuth.rejected, state => {
        state.isAuthenticated = false;
        state.user = { _id: null, customerName: null, email: null, role: null, address: null, phone: null };
        state.loading = 'failed';
      })

      // Register actions
      .addCase(register.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(register.fulfilled, state => {
        state.loading = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      // Admin registration actions
      .addCase(registerAdmin.fulfilled, (state, action) => {
        console.log('Admin created successfully:', action.payload);
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        console.error('Admin creation failed:', action.payload);
      });
  },
});

export const { setUser, updateUserStatus } = authSlice.actions;
export default authSlice.reducer;
