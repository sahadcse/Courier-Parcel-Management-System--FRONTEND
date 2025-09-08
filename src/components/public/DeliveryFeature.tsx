'use client'

import Image from "next/image";
import {CheckCircle} from 'lucide-react'


export default function DeliveryFeature() {
    const features = ["Fastest Delivery", "Secured Packaging", "24/7 Support", "Worldwide Service"];
    return (
        <section className="bg-gray-50 py-16 sm:py-24 dark:bg-gray-800">
            <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 ">
                <div className="text-gray-800 dark:text-gray-200 z-10">
                    <h2 className="text-2xl font-bold sm:text-3xl">GET THE <span className="text-yellow-500">FASTEST</span> PRODUCT DELIVERY</h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">We provide the most efficient delivery service to ensure your products arrive quickly and safely. Our streamlined process and dedicated team make us the top choice for your shipping needs.</p>
                    <ul className="mt-6 space-y-3">
                        {features.map(feature => (
                             <li key={feature} className="flex items-center gap-3">
                                <CheckCircle className="text-yellow-500" size={20} />
                                <span className="font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <span className="border-4 border-gray-200 mt-28 md:mt-0 min-h-[45%] min-w-[30%] md:min-h-[45%] md:min-w-[30%]  absolute right-[30%]"></span>
                <div className="z-10">
                     <Image
                        src="/img/DeliveryPersonRunning.png"
                        alt="Delivery person running with a package"
                        width={500}
                        height={400}
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
}