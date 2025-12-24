'use client';

import Image from "next/image";
import { useState } from "react";
import { Calculator } from "lucide-react";

const FormRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</label>
    <div className="sm:col-span-2">
      {children}
    </div>
  </div>
);

export default function QuoteCalculator() {
  const [cost, setCost] = useState(150);

  return (
    <section id="quote" className="bg-white py-24 text-slate-900 dark:bg-slate-900 dark:text-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Information Side */}
          <div className="lg:w-1/2">
            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">Quote Calculator</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6">Calculate Your <br /> Shipping Cost</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Get an instant estimate for your shipment. We offer competitive rates for local and international deliveries. Just enter your parcel details to get started.
            </p>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800">
              {/* Use proper Next Image */}
              <Image
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=2070"
                alt="Logistics warehouse"
                width={600}
                height={400}
                className="object-cover w-full h-[300px]"
              />
            </div>
          </div>

          {/* Calculator Form Side */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-xl p-8 lg:p-12 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
                <Calculator className="text-primary-600" size={28} />
                <h3 className="text-2xl font-bold">Quick Estimate</h3>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Height (cm)</label>
                    <input type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Width (cm)</label>
                    <input type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Depth (cm)</label>
                    <input type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="From Country/City" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                    <input type="text" placeholder="To Country/City" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Package Type</label>
                  <select className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                    <option>Standard Package</option>
                    <option>Document</option>
                    <option>Fragile Items</option>
                    <option>Heavy Cargo</option>
                  </select>
                </div>

                {/* Total Cost Display */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase">Estimated Total Cost</p>
                    <p className="text-4xl font-black text-primary-600">${cost.toFixed(2)}</p>
                  </div>
                  <button type="button" className="w-full md:w-auto bg-slate-900 dark:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold tracking-wide hover:bg-slate-800 dark:hover:bg-primary-500 transition-colors shadow-lg">
                    CALCULATE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
