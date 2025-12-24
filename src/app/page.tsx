'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Ship, Truck, Plane, Loader2, Package, Search, ArrowRight } from 'lucide-react';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import BookingForm from '@/components/dashboard/BookingForm';

import Header from '@/components/public/Header';
import About from '@/components/public/About';
import ContactSection from '@/components/public/ContactSection';
import TestimonialSection from '@/components/public/TestimonialSection';
import CtaBanner from '@/components/public/CtaBanner';
import DeliveryFeature from '@/components/public/DeliveryFeature';
import PricingPlans from '@/components/public/PricingPlans';
import ProcessSteps from '@/components/public/ProcessSteps';
import FaqSection from '@/components/public/FaqSection'
import QuoteCalculator from '@/components/public/QuoteCalculator';
import Footer from '@/components/public/Footer';

// Types for Tracking Data
interface TrackingData {
  parcelId: string;
  status: string;
  helpline: string;
}

// Main Page Component
export default function LandingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await api.get(`/track/${trackingId}`);
      if (response.data.success) {
        setTrackingData(response.data.data);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 404) {
          setError('No parcel found with this tracking ID. Please check your ID and try again.');
        } else {
          setError('Unable to retrieve tracking information at this time. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Header />

      {/* --- Main Hero Section --- */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070"
            alt="Global logistics background"
            fill
            priority
            quality={90}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-32 lg:pt-40">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Hero Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium tracking-wide text-green-300">#1 Logistics Partner in 2024</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
                  Delivery that <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">Moves the World</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Experience standard, express, and premium delivery services tailored to your needs. Fast, secure, and reliable shipping worldwide.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="#quote" className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-xl shadow-primary-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2">
                    Get a Quote <ArrowRight size={20} />
                  </a>
                  <a href="#services" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-md border border-white/10 transition-all flex items-center justify-center">
                    Our Services
                  </a>
                </div>

                <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-slate-400">
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <Truck size={24} /> <span className="text-sm">Land</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <Plane size={24} /> <span className="text-sm">Air</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <Ship size={24} /> <span className="text-sm">Ocean</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tracking Card - Floating Glass UI */}
            <motion.div
              id="tracking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:w-[450px] w-full"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">Track Your Shipment</h3>
                  <p className="text-slate-300 text-sm mb-6">Enter your tracking ID to see real-time updates.</p>

                  <form onSubmit={handleTrackProduct} className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        value={trackingId}
                        onChange={e => setTrackingId(e.target.value)}
                        placeholder="Enter Tracking ID (e.g. TRK-001)"
                        className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-600/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : 'Track Now'}
                    </button>
                  </form>

                  {/* Tracking Results */}
                  {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                      <p className="text-red-200 text-sm flex items-start gap-2">
                        <span className="text-lg">⚠️</span> {error}
                      </p>
                    </motion.div>
                  )}

                  {trackingData && (
                    <motion.div
                      key={trackingData.parcelId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 bg-slate-900/60 rounded-xl p-5 border border-white/10"
                    >
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                        <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Parcel ID</p>
                          <p className="text-white font-mono font-bold">{trackingData.parcelId}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Status</p>
                          <span className="px-3 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/30 text-sm font-bold">
                            {trackingData.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Helpline</p>
                          <p className="text-white font-bold">{trackingData.helpline}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>



          </div>



        </div>
      </section>

      {/* --- Booking Section --- */}
      <BookingForm redirectIfUnauthenticated={true} />

      {/* --- Components Flow --- */}
      {/* Note: ID wrappers removed as components now handle their own sections/ids */}
      <About />
      <ProcessSteps />
      <QuoteCalculator />
      <DeliveryFeature />
      <PricingPlans />
      <TestimonialSection />
      <CtaBanner />
      <FaqSection />
      <ContactSection />

      <Footer />
    </div>
  );
}
