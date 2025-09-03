// src/lib/parcelSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from './api';
import { isApiError, Parcel, ParcelCreateInput } from '@/types';

// Define the types based on your openapi.yaml schema
// export interface Parcel {
//   _id: string;
//   parcelId: string;
//   sender: string;
//   assignedAgent?: string;
//   deliveryAddress: string;
//   receiverName: string;
//   status: 'Booked' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Failed';
//   createdAt: string;
//   pickupAddress: string;
//   receiverNumber: string;
//   deliveryCoordinates?: {
//     type: 'Point';
//     coordinates: [number, number]; // [lng, lat]
//   };
// }

interface ParcelState {
  parcels: Parcel[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ParcelState = {
  parcels: [],
  loading: 'idle',
  error: null,
};

// Async thunk to fetch the customer's parcel history
export const fetchParcels = createAsyncThunk('parcels/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/parcels/all');
    // console.log("Parcel from Slice :",response.data.data);
    return response.data.data;
  } catch (error: unknown) {
    if (isApiError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parcels');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

// Async thunk to create a new parcel
export const createParcel = createAsyncThunk(
  'parcels/create',
  async (parcelData: ParcelCreateInput, { rejectWithValue }) => {
    try {
      const response = await api.post('/parcels/create', parcelData);
      return response.data.data;
    } catch (error: unknown) {
      if (isApiError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch parcels');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

// Async thunk to update parcel status
export const updateParcelStatus = createAsyncThunk(
  'parcels/updateStatus',
  async ({ parcelId, status }: { parcelId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/parcels/${parcelId}`, { status });
      return response.data.data; // Return the updated parcel
    } catch (error: unknown) {
      if (isApiError(error)) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

// New async thunk to assign an agent to a parcel
export const assignAgentToParcel = createAsyncThunk(
  'parcels/assignAgent',
  async ({ parcelId, agentId }: { parcelId: string; agentId: string }, { rejectWithValue }) => {
    try {
      // The payload for the admin update endpoint
      const response = await api.patch(`/parcels/${parcelId}`, { assignedAgent: agentId });
      return response.data.data;
    } catch (error: unknown) {
      if (isApiError(error)) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue('Failed to assign agent');
    }
  },
);

const parcelSlice = createSlice({
  name: 'parcels',
  initialState,
  reducers: {
    // reducer to handle real-time updates
    updateParcelInList: (state, action: PayloadAction<Parcel>) => {
      const index = state.parcels.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.parcels[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Parcels
      .addCase(fetchParcels.pending, state => {
        state.loading = 'pending';
      })
      .addCase(fetchParcels.fulfilled, (state, action: PayloadAction<Parcel[]>) => {
        state.loading = 'succeeded';
        state.parcels = action.payload;
      })
      .addCase(fetchParcels.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Create Parcel
      .addCase(createParcel.fulfilled, (state, action: PayloadAction<Parcel>) => {
        console.log('Successfully created parcel:', action.payload.parcelId);
        // state.parcels.unshift(action.payload); // Add new parcel to the top of the list
      })
      // Handle status update
      .addCase(updateParcelStatus.fulfilled, (state, action: PayloadAction<Parcel>) => {
        // Find the index of the updated parcel and replace it
        const index = state.parcels.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.parcels[index] = action.payload;
        }
      })

      // Handle agent assignment update
      .addCase(assignAgentToParcel.fulfilled, (state, action: PayloadAction<Parcel>) => {
        const index = state.parcels.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.parcels[index] = action.payload;
        }
      });
  },
});

export const { updateParcelInList } = parcelSlice.actions;
export default parcelSlice.reducer;
