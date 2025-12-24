'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { register, registerAgent } from '@/lib/authSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { RegisterInput } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Loader2, Briefcase } from 'lucide-react';
import Link from 'next/link';

function RegisterForm() {
  const [formData, setFormData] = useState<RegisterInput>({});
  const [role, setRole] = useState<'customer' | 'agent'>('customer');
  const { isAuthenticated, user, loading, error } = useSelector((state: RootState) => state.auth);
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!formData.customerName || !formData.email || !formData.password) {
      return;
    }

    const registerAction = role === 'agent' ? registerAgent(formData) : register(formData);
    const resultAction = await dispatch(registerAction);

    if (resultAction.type.endsWith('/fulfilled')) {
      const successMsg = role === 'agent'
        ? 'Application Submitted! An admin will review your account shortly.'
        : 'Registration successful! Redirecting to login...';
      setSuccessMessage(successMsg);
      setTimeout(() => router.push('/login'), 5000);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      router.push(`/${user.role}`);
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl rounded-3xl overflow-hidden flex flex-col">

          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-2"
              >
                Create Account
              </motion.h1>
              <p className="text-slate-500 dark:text-slate-400">Join our global logistics network today</p>
            </div>

            {/* Role Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-100 dark:bg-slate-950/50 p-1.5 rounded-xl flex items-center relative gap-1 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setRole('customer')}
                  className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${role === 'customer' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                  <User size={16} />
                  <span>Customer</span>
                </button>
                <button
                  onClick={() => setRole('agent')}
                  className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${role === 'agent' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                  <Briefcase size={16} />
                  <span>Agent Partner</span>
                </button>

                {/* Rolling Background */}
                <motion.div
                  layout
                  className="absolute top-1.5 bottom-1.5 bg-primary-600 rounded-lg shadow-md"
                  initial={false}
                  animate={{
                    left: role === 'customer' ? '6px' : '50%',
                    x: role === 'customer' ? '0%' : '2px', // tiny adjustment for spacing
                    width: role === 'customer' ? 'calc(50% - 8px)' : 'calc(50% - 8px)'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                ></motion.div>
              </div>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm text-center"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1 uppercase tracking-wider">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                      name="customerName"
                      placeholder="John Doe"
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                      type="email"
                      name="email"
                      placeholder="name@company.com"
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1 uppercase tracking-wider">Phone</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address - Full Width */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 ml-1 uppercase tracking-wider">Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    name="address"
                    placeholder="123 Logistics Ave, City, Country"
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading === 'pending'}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-600/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading === 'pending' ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-bold text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
          {/* Decorative Bottom Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-accent-500 via-primary-600 to-accent-500"></div>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <RegisterForm />
  );
}