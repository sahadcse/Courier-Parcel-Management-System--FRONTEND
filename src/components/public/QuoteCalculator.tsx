'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

// Helper component for consistent form row styling
const FormRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
    <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</label>
    <div className="sm:col-span-2">
      {children}
    </div>
  </div>
);

export default function QuoteCalculator() {
  const [cost, setCost] = useState(150);
  
  // In a real app, you would have state for each input
  // and a useEffect to calculate the cost dynamically.
  // const [height, setHeight] = useState('');
  // useEffect(() => { setCost(calculateNewCost()); }, [height, ...]);

  return (
    <section className="bg-white py-14 text-gray-800 dark:bg-slate-900 dark:text-gray-200 sm:py-24 ">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
        
        {/* Left Side: Image */}
        <div className="z-10 border border-yellow-300">
          <Image
            src="/img/delivery-person.png"
            alt="Delivery person with a package"
            width={500}
            height={600}
            className="object-contain"
          />
        </div>
        
        {/* Right Side: Form */}
        <div className="relative">
          {/* Faded background text */}
          <h2
            className="absolute -top-96 md:-top-7 left-0 select-none text-5xl font-black text-gray-200 opacity-75 dark:text-gray-800 md:text-6xl lg:text-8xl"
            aria-hidden="true"
          >
            CALCULATE
          </h2>
          
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold">CALCULATE YOUR COST</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit nonummy nibh euismod tincidunt ut laoreet.
            </p>

            <form className="mt-8 space-y-4">
              <FormRow label="HEIGHT (CM):">
                <input type="number" className="w-full border-0 border-b bg-transparent p-2 focus:border-yellow-500 focus:ring-0 dark:border-gray-600" />
              </FormRow>
              <FormRow label="WIDTH (CM):">
                <input type="number" className="w-full border-0 border-b bg-transparent p-2 focus:border-yellow-500 focus:ring-0 dark:border-gray-600" />
              </FormRow>
              <FormRow label="DEPTH (CM):">
                <input type="number" className="w-full border-0 border-b bg-transparent p-2 focus:border-yellow-500 focus:ring-0 dark:border-gray-600" />
              </FormRow>
              <FormRow label="WEIGHT (KG):">
                <input type="number" className="w-full border-0 border-b bg-transparent p-2 focus:border-yellow-500 focus:ring-0 dark:border-gray-600" />
              </FormRow>
              <FormRow label="LOCATION:">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="FROM" className="w-full border-0 border-b bg-transparent p-2 focus:border-yellow-500 focus:ring-0 dark:border-gray-600" />
                  <input type="text" placeholder="TO" className="w-full border-0 border-b bg-transparent p-2 focus:border-yellow-500 focus:ring-0 dark:border-gray-600" />
                </div>
              </FormRow>
              <FormRow label="PACKAGE:">
                <select className="w-full border-0 border-b bg-transparent p-2 focus:border-yellow-500 focus:ring-0 dark:border-gray-600 dark:bg-slate-900">
                  <option>Select Your Package</option>
                  <option>Document</option>
                  <option>Small Box</option>
                </select>
              </FormRow>

              {/* Total Cost Display */}
              <div className="flex pt-4">
                <span className="bg-yellow-500 px-6 py-3 font-bold text-slate-900">TOTAL COST:</span>
                <span className="flex-grow bg-gray-100 px-6 py-3 text-right font-bold text-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  ${cost.toFixed(2)}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}