'use client'

import Image from "next/image";



export default function CtaBanner() {
    return (
        <section className="relative py-20 text-center text-white">
            <Image
                src="https://images.unsplash.com/photo-1471991750293-5fc0e377b550?q=80&w=1964" // Placeholder crowd background
                alt="Crowded street"
                fill
                className="object-cover opacity-30"
            />
             <div className="absolute inset-0 bg-slate-800/70"></div>
            <div className="container relative mx-auto px-4">
                <h2 className="text-3xl font-bold sm:text-4xl">Are you searching for a logistics solution?</h2>
                <p className="mt-2">We are ready to take the challenge.</p>
                <button className="mt-6 rounded-md bg-yellow-500 px-8 py-3 font-semibold text-slate-900">VIEW ALL SERVICES</button>
            </div>
        </section>
    );
}