'use client'

import Image from "next/image";
import { CheckCircle, Clock, ShieldCheck, Headphones, Globe } from 'lucide-react';

export default function DeliveryFeature() {
    const features = [
        { title: "Fastest Delivery", desc: "Express options for urgent shipments.", icon: <Clock size={20} className="text-white" /> },
        { title: "Secured Packaging", desc: "Tamper-proof specialized boxes.", icon: <ShieldCheck size={20} className="text-white" /> },
        { title: "24/7 Support", desc: "Real-time updates anytime.", icon: <Headphones size={20} className="text-white" /> },
        { title: "Worldwide Service", desc: "Connecting 220+ countries.", icon: <Globe size={20} className="text-white" /> }
    ];

    return (
        <section id="services" className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Content Side */}
                    <div className="order-2 lg:order-1 relative z-10">
                        <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-2 leading-tight">
                            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Fastest</span> & Most Reliable Delivery
                        </h2>
                        <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            We prioritize speed without compromising safety. Our optimized logistics network ensures your packages travel the most efficient routes, saving you time and cost.
                        </p>

                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature) => (
                                <div key={feature.title} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-100 transition-colors">
                                    <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/20">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{feature.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Side - Creative Layout */}
                    <div className="order-1 lg:order-2 relative">
                        {/* Abstract Background Shapes */}
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-100/50 rounded-full blur-3xl"></div>
                        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-blue-100/50 rounded-full blur-3xl"></div>

                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                            {/* Use a high quality placeholder if local image is basic. Using generic delivery image for "World Class" feel. */}
                            <Image
                                src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=1974&auto=format&fit=crop"
                                alt="Professional courier delivery"
                                width={600}
                                height={500}
                                className="object-cover w-full h-[500px] hover:scale-105 transition-transform duration-700"
                            />

                            {/* Floating Badge */}
                            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl flex items-center gap-4 max-w-xs">
                                <div className="text-primary-600 font-bold text-3xl">10k+</div>
                                <div className="text-sm font-medium text-slate-700 leading-tight">Daily Deliveries Completed Successfully</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
