import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from './axios';
import { isApiError, PublicTrackingInfo } from '@/types';

interface SingleTrackState {
  trackingInfo: PublicTrackingInfo | null;
  liveLocation: { lat: number; lng: number } | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SingleTrackState = {
  trackingInfo: null,
  liveLocation: null,
  loading: 'idle',
  error: null,
};

// Thunk to fetch all tracking data for a single parcel
export const fetchTrackingData = createAsyncThunk(
  'singleTrack/fetchData',
  async (parcelId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/track/${parcelId}`);
      return response.data.data;
    } catch (err: unknown) {
      if (isApiError(err)) return rejectWithValue(err.response?.data?.message);
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const singleTrackSlice = createSlice({
  name: 'singleTrack',
  initialState,
  reducers: {
    // Reducer to handle live location updates from Socket.IO
    setLiveLocation: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.liveLocation = action.payload;
    },
    // Reducer to clear data when starting a new search
    clearTrackingData: (state) => {
      state.trackingInfo = null;
      state.liveLocation = null;
      state.error = null;
      state.loading = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackingData.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchTrackingData.fulfilled, (state, action: PayloadAction<PublicTrackingInfo>) => {
        state.loading = 'succeeded';
        state.trackingInfo = action.payload;
        // Set the initial location from the fetched history
        if (action.payload.trackingHistory && action.payload.trackingHistory.length > 0) {
          const lastPoint = action.payload.trackingHistory[action.payload.trackingHistory.length - 1];
          state.liveLocation = lastPoint.coordinates;
        }
      })
      .addCase(fetchTrackingData.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setLiveLocation, clearTrackingData } = singleTrackSlice.actions;
export default singleTrackSlice.reducer;