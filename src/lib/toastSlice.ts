import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    // The payload type is adjusted to be more flexible
    addToast: (state, action: PayloadAction<{ message: unknown; type: Toast['type'] }>) => {
      const newToast = {
        id: new Date().getTime().toString(),
        // FIX: Ensure the message is always converted to a string
        message: String(action.payload.message || 'An unknown error occurred.'),
        type: action.payload.type,
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
