// src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import parcelReducer from './parcelSlice';
import adminReducer from './adminSlice';
import trackingReducer from './trackingSlice';
import singleTrackReducer from './singleTrackSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    tracking: trackingReducer,
    parcels: parcelReducer,
    admin: adminReducer,
    singleTrack: singleTrackReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
