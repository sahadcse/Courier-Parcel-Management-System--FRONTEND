'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Globe, Star, Users, Trophy } from 'lucide-react';

const features = [
  { icon: <Rocket size={24} />, title: 'FAST DELIVERY', description: 'Next-day delivery across major cities.' },
  { icon: <ShieldCheck size={24} />, title: 'SECURED SERVICE', description: 'Full insurance coverage for every package.' },
  { icon: <Globe size={24} />, title: 'WORLDWIDE SHIPPING', description: 'International logistics network in 200+ countries.' },
];

export default function AboutUs() {
  return (
    <section id="about" className="bg-white dark:bg-slate-900 py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1280px]">

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">About Our Company</span>
              <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6 text-slate-900 dark:text-white leading-tight">
                We Provide <span className="text-primary-600">Reliable</span> & <br /> Fast Delivery Service
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                ProCourier has been the trusted logistics partner for thousands of businesses since 2010. We leverage cutting-edge technology and a vast delivery network to ensure your parcels reach their destination on time, every time.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-green-100 text-green-600"><Star size={18} /></div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Top Rated Service (4.9/5)</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600"><Users size={18} /></div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">1M+ Happy Customers</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-orange-100 text-orange-600"><Trophy size={18} /></div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Best Logistics Award 2024</span>
                </li>
              </ul>

              <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:bg-primary-600 dark:hover:bg-primary-400 dark:hover:text-white transition-colors duration-300">
                Read More About Us
              </button>
            </motion.div>

            {/* Decor elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30 -z-10"></div>
          </div>

          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070"
                alt="Logistics warehouse interior"
                width={800}
                height={600}
                className="object-cover h-[500px]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <p className="text-white font-medium">"Our mission is to simplify global trade for everyone."</p>
                <p className="text-primary-400 text-sm mt-2 font-bold">- CEO, ProCourier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
