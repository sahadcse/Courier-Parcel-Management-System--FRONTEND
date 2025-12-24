'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "The tracking system is absolutely world-class. I could see exactly where my sensitive documents were at every stage. Highly recommended!",
    author: 'Bushra Ahsani',
    role: 'Corporate Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1974',
    rating: 5
  },
  {
    quote: "Fastest delivery I've experienced in Dhaka. The packaging was secure and the delivery personnel were extremely professional.",
    author: 'Sahad Rahman',
    role: 'E-commerce Seller',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974',
    rating: 5
  },
  {
    quote: "Customer support went above and beyond when I needed to change the delivery address last minute. Truly reliable service.",
    author: 'Fatima Khan',
    role: 'Small Business Owner',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961',
    rating: 4
  },
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="relative py-24 bg-slate-900 text-white overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-900"></div>

      <div className="relative z-10 container mx-auto px-6 max-w-[1280px]">
        <div className="text-center mb-16">
          <span className="text-primary-500 font-bold tracking-wider uppercase text-sm">Testimonials</span>
          <h2 className="text-4xl font-bold mt-2">What Our Clients Say</h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
          >
            <ChevronRight size={24} />
          </button>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 shadow-lg relative z-10">
                    <Image
                      src={testimonials[activeIndex].avatar}
                      alt={testimonials[activeIndex].author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary-600 rounded-full p-2 text-white shadow-lg z-20">
                    <Quote size={16} fill="currentColor" />
                  </div>
                </div>

                <div className="flex gap-1 mb-6 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill={i < testimonials[activeIndex].rating ? "currentColor" : "none"} className={i >= testimonials[activeIndex].rating ? "text-slate-600" : ""} />
                  ))}
                </div>

                <p className="text-xl md:text-2xl italic leading-relaxed text-slate-200 mb-8">
                  "{testimonials[activeIndex].quote}"
                </p>

                <div>
                  <h4 className="text-xl font-bold text-white">{testimonials[activeIndex].author}</h4>
                  <p className="text-primary-400 text-sm font-medium uppercase tracking-wide mt-1">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`nav-dot w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-primary-500 w-8' : 'bg-slate-600 hover:bg-slate-500'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
