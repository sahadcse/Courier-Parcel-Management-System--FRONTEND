'use client';

import { ClipboardList, Package, Truck, CheckCircle } from 'lucide-react';

export default function ProcessSteps() {
  const steps = [
    { num: 1, title: 'Book Order', description: 'Fill out details and schedule pickup.', icon: <ClipboardList size={32} /> },
    { num: 2, title: 'Pack & Label', description: 'Secure packaging with generated label.', icon: <Package size={32} /> },
    { num: 3, title: 'We Collect', description: 'Our agent picks up from your doorstep.', icon: <Truck size={32} /> },
    { num: 4, title: 'Delivered', description: 'Safely delivered to the destination.', icon: <CheckCircle size={32} /> },
  ];

  return (
    <section id="process" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">How It Works</span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-2">Simple 4-Step Process</h2>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 z-0">
            <div className="h-full bg-primary-100/50 w-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={step.num} className="group flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:border-primary-500">
                  <div className="text-primary-600">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm border-4 border-white dark:border-slate-900">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
