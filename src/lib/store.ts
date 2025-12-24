// src/lib/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import parcelReducer from './parcelSlice';
import adminReducer from './adminSlice';
import trackingReducer from './trackingSlice';
import singleTrackReducer from './singleTrackSlice';
import toastSlice from './toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    tracking: trackingReducer,
    parcels: parcelReducer,
    admin: adminReducer,
    singleTrack: singleTrackReducer,
    toast: toastSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
import { TypedUseSelectorHook, useSelector } from 'react-redux';
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
