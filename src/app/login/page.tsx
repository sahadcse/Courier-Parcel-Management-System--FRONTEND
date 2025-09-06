// src/app/login/page.tsx
'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/authSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { LoginInput } from '@/types';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginInput>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Local state for the button
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error, isAuthenticated, user  } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      // You can set a local error state here if you want
      // For example: setError("Please enter both email and password.");
      return; 
    }
    setIsSubmitting(true);
    try {
      // .unwrap() will throw an error if the thunk is rejected
      await dispatch(login(formData)).unwrap();
      // Successful login will trigger the useEffect below to redirect
    } catch (rejectedValueOrSerializedError) {
      // Error is handled by the Redux slice, no extra action needed here
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // This effect runs when the login is successful and the user object is populated
    if (isAuthenticated && user?.role) {
      // Redirect based on the user's role
      router.push(`/${user.role}`);
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:text-white dark:bg-black">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-96 dark:bg-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-500 text-white p-3 rounded hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-600">Don&apos;t have an account? </span>
        <a
          href="/register"
          className="text-primary-600 hover:underline font-medium"
        >
          Register
        </a>
      </div>
    </div>
  );
}