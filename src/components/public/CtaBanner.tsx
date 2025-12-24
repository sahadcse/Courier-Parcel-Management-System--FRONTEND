'use client'

import Image from "next/image";
import Link from 'next/link';

export default function CtaBanner() {
    return (
        <section id="cta" className="relative py-28 text-center text-white overflow-hidden">
            {/* Background Image with optimized Next.js Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
                    alt="Global logistics network background"
                    fill
                    className="object-cover"
                    quality={90}
                    priority={false}
                />
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 px-6">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                    Ready to Optimize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">Logistics Chain?</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                    Join thousands of businesses that trust ProCourier for faster, safer, and smarter delivery solutions worldwide.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="#services"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg shadow-xl shadow-primary-600/30 transition-all duration-300 hover:scale-105"
                    >
                        Explore Services
                    </Link>
                    <Link
                        href="#contact"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg backdrop-blur-md border border-white/20 transition-all duration-300"
                    >
                        Contact Sales
                    </Link>
                </div>
            </div>
        </section>
    );
}