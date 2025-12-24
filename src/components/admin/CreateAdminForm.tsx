// src/components/admin/CreateAdminForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { registerAdmin } from '@/lib/authSlice';
import { RegisterAdminInput } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, CheckCircle, AlertOctagon, Key } from 'lucide-react';

export default function CreateAdminForm() {
  const [formData, setFormData] = useState<RegisterAdminInput>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [passwordShow, setPasswordShow] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.password || !formData.registerKey) {
      setError('Please fill out all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const message = await dispatch(registerAdmin(formData)).unwrap();
      setSuccessMessage(message || 'Admin account created successfully!');
      (e.target as HTMLFormElement).reset();
      setFormData({});
      setTimeout(() => setSuccessMessage(null), 3000);
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
    <div className="max-w-xl mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
            <UserPlus size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Register New Admin</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Grant full system access to a new user.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="text"
                name="customerName"
                placeholder="e.g. Jane Doe"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="email"
                name="email"
                placeholder="admin@company.com"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type={passwordShow ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordShow(!passwordShow)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                {passwordShow ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          {/* Super Secret Key */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Admin Secret Key</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="password"
                name="registerKey"
                placeholder="Required for admin privileges"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
              >
                <AlertOctagon size={18} /> {error}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
              >
                <CheckCircle size={18} /> {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:shadow-lg hover:transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create Admin Account</>
            )}
          </button>
        </form>

        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
}
