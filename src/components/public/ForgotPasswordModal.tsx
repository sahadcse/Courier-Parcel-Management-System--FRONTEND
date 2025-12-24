'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1500);
    };

    const handleClose = () => {
        setIsSent(false);
        setEmail('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-white/20 dark:border-slate-800">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-8">
                                {isSent ? (
                                    <div className="flex flex-col items-center text-center py-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6"
                                        >
                                            <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
                                            We've sent password reset instructions to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
                                        </p>
                                        <button
                                            onClick={handleClose}
                                            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-3.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Back to Login
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-2">
                                                Forgot Password?
                                            </h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                Enter your email address and we'll send you a link to reset your password.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="name@example.com"
                                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-600/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={20} />
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Send Reset Link</span>
                                                        <ArrowRight size={20} />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
