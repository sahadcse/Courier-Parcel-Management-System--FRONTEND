// components/auth/LogoutButton.tsx

'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/store';
import { logoutUser } from '@/lib/authSlice';

export default function LogoutButton() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    // Dispatch the logout action
    const result = await dispatch(logoutUser());

    // After the action is fulfilled, redirect to the login page
    if (logoutUser.fulfilled.match(result)) {
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading === 'pending'}
      className="bg-error text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
    >
      {loading === 'pending' ? 'Logging out...' : 'Logout'}
    </button>
  );
}