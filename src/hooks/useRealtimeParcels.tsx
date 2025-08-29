// useRealtimeParcels.tsx

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { updateParcelInList } from '@/lib/parcelSlice';
import { Parcel } from '@/types';

import { RootState } from '@/lib/store';
import { updateUserStatus } from '@/lib/authSlice';

// 1. Create a context to hold the socket instance
const SocketContext = createContext<Socket | null>(null);

// 2. Create a provider component
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  // This useEffect will run ONLY ONCE on the CLIENT-SIDE after the component mounts
  useEffect(() => {
    // 1. Create the socket connection here
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
    });

    // 2. Save the socket instance in state
    setSocket(newSocket);

    // 3. Clean up the connection when the app unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // The empty dependency array is crucial

  // This separate useEffect sets up event listeners once the socket is created
  useEffect(() => {
    // Don't attach listeners until the socket is ready
    if (!socket) return;

    socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
      // 1. If a user is logged in, register them with the server
      if (user?._id) {
        socket.emit('registerUser', user._id);
      }
    });
    // 2. Listen for the status update event from the server
    socket.on('user:status-updated', updatedUser => {
      console.log('Received user status update:', updatedUser);
      dispatch(updateUserStatus(updatedUser));
    });
    socket.on('parcel:updated', (updatedParcel: Parcel) => {
      console.log('📦 Parcel status updated in real-time:', updatedParcel);
      dispatch(updateParcelInList(updatedParcel));
    });

    socket.on('disconnect', () => console.log('❌ Disconnected from Socket.IO server'));

    // Cleanup listeners
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('parcel:updated');
      socket.off('user:status-updated');
    };
  }, [socket, dispatch, user]); // This effect re-runs if the socket instance changes

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

// 3. Create a custom hook to easily access the socket
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    // throw new Error('useSocket must be used within a SocketProvider');
    return null;
  }
  return socket;
};
