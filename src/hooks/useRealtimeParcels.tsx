// useRealtimeParcels.tsx

'use client';

import api from '@/lib/api';

import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { updateParcelInList } from '@/lib/parcelSlice';
import { Parcel } from '@/types';

import { RootState } from '@/lib/store';
import { updateUserStatus } from '@/lib/authSlice';

// Create a context to hold the socket instance
const SocketContext = createContext<Socket | null>(null);

// Create a provider component
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // This useEffect manages the entire socket lifecycle
  useEffect(() => {
    // Only attempt to connect if the user is authenticated and auth loading is finished
    if (isAuthenticated && loading === 'succeeded') {
      // Create the socket connection
      const newSocket = io(process.env.SOCKET_API_URL || 'http://localhost:5000', {
        withCredentials: true,
        // We prevent auto-connection to manually handle it after a refresh
        autoConnect: true,
      });

      setSocket(newSocket);

      // --- Event Listeners ---

      newSocket.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');
        if (user?._id) {
          newSocket.emit('registerUser', user._id);
        }
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from Socket.IO server');
      });

      // 2. THIS IS THE KEY: Listen for connection errors
      newSocket.on('connect_error', async err => {
        console.error('Socket.IO connection error:', err.message);

        // Check if the error is due to an expired/invalid token
        if (err.message.includes('Invalid token') || err.message.includes('Authentication error')) {
          console.log('Attempting to refresh token for Socket.IO...');
          try {
            // 3. Use your existing Axios instance to refresh the token
            await api.post('/auth/refresh');
            console.log('Token refreshed successfully. Reconnecting socket...');

            // 4. Manually try to connect again after a successful refresh
            newSocket.connect();
          } catch (refreshError) {
            console.error('Failed to refresh token for Socket.IO:', refreshError);
            // If refresh fails, the user will be logged out by the Axios interceptor
          }
        }
      });

      // Your application-specific listeners
      newSocket.on('user:status-updated', updatedUser => {
        dispatch(updateUserStatus(updatedUser));
      });

      newSocket.on('parcel:updated', (updatedParcel: Parcel) => {
        dispatch(updateParcelInList(updatedParcel));
      });

      // Cleanup function to run when the component unmounts or user logs out
      return () => {
        console.log('Disconnecting socket...');
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, loading, dispatch, user?._id]); // Re-run when auth state changes

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

// Custom hook to easily access the socket (no changes needed here)
export const useSocket = () => {
  return useContext(SocketContext);
};
