'use client'

import Image from "next/image";
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';


export default function Footer() {
    return (
        <footer className="bg-slate-900 py-12 text-gray-400">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
                <div>
                    <h3 className="text-3xl font-bold text-white">Pro<span className="text-yellow-500">Courier</span>→</h3>
                    <p className="mt-4 text-sm">Your reliable partner in logistics and delivery, ensuring your parcels are handled with care.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-white">QUICK LINKS</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#" className="hover:text-yellow-500">About Us</a></li>
                        <li><a href="#" className="hover:text-yellow-500">Services</a></li>
                        <li><a href="#" className="hover:text-yellow-500">Contact</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-white">SERVICES</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#" className="hover:text-yellow-500">Local Delivery</a></li>
                        <li><a href="#" className="hover:text-yellow-500">International Shipping</a></li>
                        <li><a href="#" className="hover:text-yellow-500">Freight</a></li>
                    </ul>
                </div>
                 <div className="flex flex-col items-center justify-center space-y-8 text-center md:items-start md:text-left">
                    <h3 className="text-xl font-semibold uppercase">GET IN TOUCH</h3>
                    
                    {/* Social Media Icons */}
                    <div className="flex justify-center gap-4 md:justify-start">
                        <a href="#" aria-label="Facebook" className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-600 text-gray-400 transition-colors hover:border-yellow-500 hover:text-yellow-500">
                            <Facebook size={24} />
                        </a>
                        <a href="#" aria-label="Twitter" className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-600 text-gray-400 transition-colors hover:border-yellow-500 hover:text-yellow-500">
                            <Twitter size={24} />
                        </a>
                        {/* Using Github as a placeholder for Google+ since Lucide doesn't have a direct G+ icon */}
                        <a href="#" aria-label="Google Plus" className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-600 text-gray-400 transition-colors hover:border-yellow-500 hover:text-yellow-500">
                            <Github size={24} /> {/* Placeholder for G+ */}
                        </a>
                        <a href="#" aria-label="LinkedIn" className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-600 text-gray-400 transition-colors hover:border-yellow-500 hover:text-yellow-500">
                            <Linkedin size={24} />
                        </a>
                    </div>

                    {/* Payment Logos */}
                    <div className="flex flex-wrap justify-center gap-4 pt-4 md:justify-start">
                        <Image src="/img/paypal.png" alt="PayPal" width={80} height={50} className="h-8 w-auto object-contain" />
                        <Image src="/img/mastercard.png" alt="Mastercard" width={60} height={30} className="h-8 w-auto object-contain" />
                        <Image src="/img/visa.png" alt="Visa" width={70} height={40} className="h-8 w-auto object-contain" />
                        <Image src="/img/amex.png" alt="American Express" width={80} height={50} className="h-8 w-auto object-contain" />
                    </div>
                </div>
            </div>
            <div className="container mx-auto mt-8 border-t border-gray-800 pt-6 text-center text-sm">
                <p>&copy; 2025 ProCourier. All Rights Reserved.</p>
            </div>
        </footer>
    );
}