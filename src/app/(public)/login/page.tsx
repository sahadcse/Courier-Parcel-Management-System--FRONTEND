'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/authSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { LoginInput } from '@/types';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ForgotPasswordModal from '@/components/public/ForgotPasswordModal';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginInput>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(login(formData)).unwrap();
    } catch {
      // Error handled by Redux
    } finally {
      setIsSubmitting(false);
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-10">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-2"
              >
                Welcome Back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 dark:text-slate-400"
              >
                Sign in to manage your shipments
              </motion.p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-600/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-bold text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative Bottom Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600"></div>
        </div>

        {/* Footer Credit */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.</p>
        </div>
      </motion.div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}