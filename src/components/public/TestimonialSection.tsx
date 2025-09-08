'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the structure for a single testimonial
interface Testimonial {
  quote: string;
  author: string;
  avatar: string;
}

// Array of testimonials
const testimonials: Testimonial[] = [
  {
    quote:
      'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum.',
    author: 'BUSHRA AHSANI',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1974', // Example avatar
  },
  {
    quote: 'Excellent and professional service. My package arrived ahead of schedule and in perfect condition. Highly recommended for anyone in Dhaka!',
    author: 'SAHAD RAHMAN',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974', // Example avatar
  },
  {
    quote: 'Reliable and fast. The tracking system is very accurate, and the customer support is top-notch. I will definitely be using this service again.',
    author: 'FATIMA KHAN',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961', // Example avatar
  },
];

export default function TestimonialSection() {
  // State to keep track of the current testimonial index
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      // Loop to the last testimonial if at the beginning
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      // Loop back to the first testimonial if at the end
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="relative overflow-hidden py-16 text-white">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1592598264624-61eb71e49d7a"
        alt="Crowded street background"
        fill
        quality={80}
        className="object-cover object-center"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content Container */}
      <div className="container relative mx-auto px-4 text-center">
        {/* AnimatePresence handles the exit animation */}
        <AnimatePresence mode="wait">
          {/* motion.div handles the enter/exit animations */}
          <motion.div
            key={activeIndex} // Changing the key triggers the animation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Avatar and Play Button */}
            <div className="relative mx-auto h-24 w-24 rounded-full border-2 border-yellow-500 bg-gray-700">
              <Image
                src={activeTestimonial.avatar}
                alt={activeTestimonial.author}
                fill
                quality={100}
                className="rounded-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
                <Play size={24} className="text-white" />
              </div>
            </div>

            {/* Testimonial Quote */}
            <p className="mx-auto mt-8 min-h-[150px] max-w-3xl text-lg italic leading-relaxed text-gray-200">
              &ldquo;{activeTestimonial.quote}&rdquo;
            </p>

            {/* Author */}
            <p className="mt-6 text-xl font-semibold uppercase tracking-wider text-yellow-500">
              {activeTestimonial.author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-0 right-1/2 flex translate-x-1/2 gap-4 sm:right-48 sm:translate-x-0">
        <button
          onClick={handlePrev}
          className="flex h-7 w-10 items-center justify-center  border border-gray-600 bg-gray-800/50 text-white transition-colors hover:border-yellow-500 hover:bg-yellow-500 hover:text-gray-900"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="flex h-7 w-10 items-center justify-center border border-gray-600 bg-gray-800/50 text-white transition-colors hover:border-yellow-500 hover:bg-yellow-500 hover:text-gray-900"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}