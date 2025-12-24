'use client'

import { Check, Package, Crosshair, Globe, Shield } from "lucide-react";
import Link from "next/link";

export default function PricingPlans() {
    const plans = [
        {
            name: 'Basic',
            price: 50,
            description: 'For local small packages',
            features: ['Up to 5kg Package', 'Local City Delivery', 'Standard Tracking', 'Monday - Friday', 'SMS Updates'],
            highlighted: false,
            icon: <Package className="text-slate-400" size={32} />
        },
        {
            name: 'Standard',
            price: 250,
            description: 'Most popular for nationwide',
            features: ['Up to 20kg Package', 'Nationwide Coverage', 'Real-time Tracking', 'Insurance up to $500', '24/7 Support'],
            highlighted: true,
            icon: <Crosshair className="text-white" size={32} />
        },
        {
            name: 'Premium',
            price: 150,
            description: 'For fast international shipping',
            features: ['Up to 10kg Package', 'International Shipping', 'Express Flight Service', 'Customs Handling', 'Premium Support'],
            highlighted: false,
            icon: <Globe className="text-slate-400" size={32} />
        },
    ];

    return (
        <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900 relative">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">Flexible Pricing</span>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-2">Transparent Pricing Plans</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
                        Choose the best plan that fits your shipment needs. No hidden charges, just reliable service.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl p-8 transition-transform duration-300 ${plan.highlighted
                                    ? 'bg-slate-900 text-white shadow-2xl scale-105 z-10 border border-slate-800'
                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg border border-slate-100 dark:border-slate-700 hover:-translate-y-2'
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold py-1 px-4 rounded-full shadow-lg">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className={`mb-6 p-4 rounded-xl inline-block ${plan.highlighted ? 'bg-white/10' : 'bg-primary-50 dark:bg-slate-700'}`}>
                                {plan.icon}
                            </div>

                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <p className={`mt-2 text-sm ${plan.highlighted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{plan.description}</p>

                            <div className="my-8">
                                <span className="text-5xl font-bold">${plan.price}</span>
                                <span className={`text-sm ml-2 ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>/ shipment</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-3">
                                        <div className={`rounded-full p-1 ${plan.highlighted ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 dark:bg-slate-600 text-primary-600 dark:text-primary-400'}`}>
                                            <Check size={16} />
                                        </div>
                                        <span className={`text-sm ${plan.highlighted ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="#contact" className={`block w-full py-4 text-center rounded-xl font-bold transition-all duration-300 ${plan.highlighted
                                    ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/30'
                                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                                }`}>
                                Choose Plan
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}