'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Ship, Truck, Plane } from 'lucide-react';

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

// Main Page Component
export default function LandingPage() {
  const [trackingId, setTrackingId] = useState('');

  const handleTrackProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trackingId) {
      alert(`Tracking parcel with ID: ${trackingId}`);
      setTrackingId('');
    }
  };

  return (
    <div className="">
      <Header />
      {/* --- Main Hero Section --- */}
      <section id="home" className="relative min-h-screen w-full text-white border-b-4 border-b-amber-400">
        {/* Background Image and Overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1570127787282-74ec255f816f"
            alt="Courier plane in a cloudy sky"
            fill
            priority
            quality={80}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60  backdrop-blur-xs"></div>
        </div>
        

        <main className="container mx-auto px-4">
          <div className="flex min-h-[85vh] flex-col items-center justify-center text-center pt-24">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-6 text-gray-300">
                <Truck size={24} />
                <Plane size={32} />
                <Ship size={24} />
              </div>
              <p className="mt-4 text-sm font-medium uppercase tracking-widest text-gray-300">
                Fast . Secured . Worldwide
              </p>
            </div>

            <h1 className="mt-14 max-w-4xl text-4xl font-bold leading-tight md:text-6xl ">
              <span className="text-yellow-500">Courier & Delivery Services</span>
            </h1>

            {/* --- Tracking Form Section --- */}
            <div id="tracking" className="mt-12 w-full max-w-2xl">
                <form
                  onSubmit={handleTrackProduct}
                  className="w-full rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-md"
                >
                  <div className="mb-2 text-left md:flex gap-3 md:justify-between md:items-baseline">
                    <h3 className="font-semibold">TRACK YOUR PRODUCT</h3>
                    <p className="text-xs text-gray-300">Now you can track your product easily</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={trackingId}
                      onChange={e => setTrackingId(e.target.value)}
                      placeholder="Enter your product ID"
                      className="flex-grow rounded-md border-none bg-white p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="submit"
                      className={`cursor-pointer rounded-md bg-yellow-500 px-8 py-3 font-semibold text-slate-900 transition-colors hover:bg-yellow-400 `}
                    >
                      SEARCH
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </main>
      </section>

      {/* --- RENDER ALL SECTIONS WITH IDs --- */}
      <div id="about"><About /></div>
      <div id="process"><ProcessSteps /></div>
      <div id="quote"><QuoteCalculator /></div>
      <div id="testimonials"><TestimonialSection /></div>
      <div id="features"><DeliveryFeature /></div>
      <div id="cta"><CtaBanner /></div>
      <div id="pricing"><PricingPlans /></div>
      <div id="contact"><ContactSection /></div>
      <div id="faq"><FaqSection/></div>
      
      <Footer />
    </div>
  );
}
