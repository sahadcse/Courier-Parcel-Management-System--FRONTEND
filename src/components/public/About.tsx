'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Globe } from 'lucide-react';

// Define the data for the feature blocks dynamically
const features = [
  {
    icon: <Rocket size={24} />,
    title: 'FAST DELIVERY',
    description: 'Duis autem vel eum iriure dolor in hendrerit.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'SECURED SERVICE',
    description: 'Duis autem vel eum iriure dolor in hendrerit.',
  },
  {
    icon: <Globe size={24} />,
    title: 'WORLDWIDE SHIPPING',
    description: 'Duis autem vel eum iriure dolor in hendrerit.',
  },
];

export default function AboutUs() {
  return (
    <section className="bg-white py-16 text-gray-800 dark:bg-slate-900 dark:text-gray-200 sm:py-6">
      <div className=" px-4">
        {/* --- Top Features Section --- */}
        <div className="w-full border-b border-gray-200">
          {/* This is your content grid */}
          <div className="grid grid-cols-1 gap-10 py-8 text-center md:grid-cols-3 md:text-left max-w-[80%] mx-auto border-b border-yellow-400">
            {features.map((feature, index) => (
              // This is the animated element from framer-motion
              <motion.div
                key={index}
                className="flex flex-col items-center gap-4 md:flex-row"
                // Initial state: invisible and 50px above its final position
                initial={{ opacity: 0, y: -50 }}
                // Animate to: fully visible and at its final position
                whileInView={{ opacity: 1, y: 0 }}
                // Animation transition settings
                transition={{ duration: 0.5, delay: index * 0.2 }}
                // Animate only once when it comes into view
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 text-yellow-500">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold tracking-wider">{feature.title}</h3>
                  <p className="mt-1 text-sm text-gray-400 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Main About Us Section --- */}
        <div className="container mx-auto mt-16 grid grid-cols-1 items-center gap-12 md:mt-24 md:grid-cols-2">
          <div className="relative">
            {/* Large, faded text in the background */}
            <h2
              className="absolute -top-8 left-0 select-none text-7xl font-black text-gray-100 opacity-75 dark:text-gray-800 md:text-8xl"
              aria-hidden="true"
            >
              ABOUT
            </h2>
            {/* Content on top */}
            <div className="relative">
              <h3 className="text-3xl font-bold sm:text-4xl">ABOUT US</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
                euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad
                minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut
                aliquip.
              </p>
            </div>
          </div>
          <div>
            <Image
              src="/img/DeliveryVan.png" // Placeholder image of a white van
              alt="Delivery van"
              width={600}
              height={400}
              className="rounded-lg object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
