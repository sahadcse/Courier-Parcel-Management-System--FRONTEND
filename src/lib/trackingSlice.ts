import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from './api';
import { isApiError, Parcel } from '@/types';
import { AgentInfo } from '@/types';

export interface LiveParcel {
  parcelId: string;
  status: string;
  assignedAgent?: AgentInfo;
  coordinates: { type: 'Point', coordinates: [number, number] };
}

interface TrackingState {
  liveParcels: { [parcelId: string]: LiveParcel };
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: TrackingState = {
  liveParcels: {},
  loading: 'idle',
};

export const fetchLiveParcels = createAsyncThunk('tracking/fetchAllLive', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/track/live');
    return response.data.data;
  } catch (err) {
    if (isApiError(err)) return rejectWithValue(err.response?.data?.message);
    return rejectWithValue('Failed to fetch live tracking data');
  }
});

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    updateParcelLocation: (state, action: PayloadAction<{ parcelId: string; coordinates: { lat: number; lng: number } }>) => {
      const { parcelId, coordinates } = action.payload;
      if (state.liveParcels[parcelId]) {
        state.liveParcels[parcelId].coordinates.coordinates = [coordinates.lng, coordinates.lat];
      }
    },
    updateLiveParcelStatus: (state, action: PayloadAction<Parcel>) => {
      const parcel = action.payload;
      if (state.liveParcels[parcel.parcelId]) {
        state.liveParcels[parcel.parcelId].status = parcel.status;
      } else if (parcel.status === 'Picked Up' || parcel.status === 'In Transit') {
        // A parcel just became active, add it to the live view (location will arrive separately)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLiveParcels.fulfilled, (state, action: PayloadAction<LiveParcel[]>) => {
      state.liveParcels = action.payload.reduce((acc, parcel) => {
        acc[parcel.parcelId] = parcel;
        return acc;
      }, {} as { [parcelId: string]: LiveParcel });
      state.loading = 'succeeded';
    });
  },
});

export const { updateParcelLocation, updateLiveParcelStatus } = trackingSlice.actions;
export default trackingSlice.reducer;