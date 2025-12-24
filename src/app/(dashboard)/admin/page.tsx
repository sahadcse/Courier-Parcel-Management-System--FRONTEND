'use client';

import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AdminAnalyticsDashboard />
    </motion.div>
  );
}