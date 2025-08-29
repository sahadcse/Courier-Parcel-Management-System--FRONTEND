'use client';

import { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { registerAdmin } from '@/lib/authSlice';
import { RegisterAdminInput } from '@/types';

export default function CreateAdminForm() {
  const [formData, setFormData] = useState<RegisterAdminInput>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [passwordShow, setPasswordShow] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.password || !formData.registerKey) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const message = await dispatch(registerAdmin(formData)).unwrap();
      setSuccessMessage(message || 'Admin account created successfully!');
      // Optionally reset the form
      (e.target as HTMLFormElement).reset();
      setFormData({});
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-semibold mb-4">Create a New Admin Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        <input
          name="customerName"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <div className="relative">
          <input
            // Conditionally set the type based on your state
            type={passwordShow ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded pr-10" // Add padding-right (pr-10) for the icon
            required
          />
          <button
            type="button" // Important to prevent form submission
            onClick={() => setPasswordShow(!passwordShow)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            {passwordShow ? 'Hide' : 'Show'}
          </button>
        </div>
        <input
          type="password"
          name="registerKey"
          placeholder="Admin Secret Key"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-700 text-white p-3 rounded mt-4 hover:bg-primary-900 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Admin...' : 'Create Admin'}
        </button>
      </form>
    </div>
  );
}
