// src/app/register/page.tsx
'use client';
import { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter  } from 'next/navigation';
import { register, registerAgent  } from '@/lib/authSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { RegisterInput } from '@/types';

function RegisterForm() {
  const [formData, setFormData] = useState<RegisterInput>({});
  const [role, setRole] = useState<'customer' | 'agent'>('customer');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [successMessage, setSuccessMessage] = useState('');

    const pageTitle = `Create ${role === 'agent' ? 'Agent' : 'Customer'} Account`;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    // Ensure all required fields are present
    if (!formData.customerName || !formData.email || !formData.password) {
      // Optionally set a local error state for form validation
      return;
    }
    // Dispatch the correct action based on the role
    const registerAction = role === 'agent' ? registerAgent(formData) : register(formData);
    const resultAction = await dispatch(registerAction);

    if (resultAction.type.endsWith('/fulfilled')) {
      const successMsg = role === 'agent' 
        ? 'Registration successful! An admin will review your account shortly.'
        : 'Registration successful! Redirecting to login...';
      setSuccessMessage(successMsg);
      setTimeout(() => router.push('/login'), 5000); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{pageTitle}</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        {/* --- Role Selector --- */}
        <div className="flex justify-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} />
            Customer
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="agent" checked={role === 'agent'} onChange={() => setRole('agent')} />
            Agent
          </label>
        </div>
        
        <div className="space-y-4">
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (Optional)"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
          <input
            name="address"
            placeholder="Address (Optional)"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading === 'pending'}
          className="w-full bg-primary-500 text-white p-3 rounded mt-6 hover:bg-primary-700 disabled:opacity-50"
        >
          {loading === 'pending' ? 'Creating Account...' : 'Register'}
        </button>
      </form>


      <div className="mt-6 text-center">
        <span>Already have an account? </span>
        <a
          href="/login"
          className="text-primary-600 hover:underline font-medium"
        >
          Login
        </a>
      </div>
    </div>
  );
}


export default function RegisterPage() {
  return (
      <RegisterForm />
  );
}