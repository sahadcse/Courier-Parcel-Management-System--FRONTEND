'use client'

import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Send, Mail, MapPin, Phone, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-8">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand & Desc */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-start leading-none group">
                            <span className="text-2xl font-bold tracking-wider text-white">COURIER-S</span>
                            <div className="flex items-center w-32 gap-2 mt-1">
                                <div className="h-[2px] flex-1 bg-primary-500"></div>
                                <span className="text-[10px] font-bold tracking-widest text-primary-500">PRO</span>
                                <div className="h-[2px] flex-1 bg-primary-500"></div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Global logistics partner delivering excellence, speed, and reliability. Your trusted choice for secure shipping worldwide.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/sahadcse" className="p-2 bg-slate-900 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Facebook size={18} /></a>
                            <a href="https://x.com/sahadcse" className="p-2 bg-slate-900 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Twitter size={18} /></a>
                            <a href="https://www.instagram.com/sahadsoftware/" className="p-2 bg-slate-900 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Instagram size={18} /></a>
                            <a href="https://www.linkedin.com/in/sahadcse/" className="p-2 bg-slate-900 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
                            <li><Link href="/#services" className="hover:text-primary-400 transition-colors">Services</Link></li>
                            <li><Link href="/#tracking" className="hover:text-primary-400 transition-colors">Track Parcel</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
                            <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Services</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Standard Shipping</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Express Delivery</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Warehousing</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Freight Forwarding</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Supply Chain</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary-500 shrink-0 mt-0.5" />
                                <span>123 Logistics Avenue, Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary-500 shrink-0" />
                                <span>+880 174 666 9174</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary-500 shrink-0" />
                                <span>sahaduzzaman.cse@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-800 my-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-slate-500">
                        &copy; {currentYear} CourierPro. All Rights Reserved.
                    </p>

                    {/* Payment Icons - "Payment Straight Line Card" */}
                    <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-lg border border-white/5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">We Accept</span>
                        <div className="flex items-center gap-3 opacity-80 grayscale hover:grayscale-0 transition-all duration-300">
                            <div className="relative w-8 h-5">
                                <Image src="/img/visa.png" alt="Visa" fill className="object-contain" />
                            </div>
                            <div className="relative w-8 h-5">
                                <Image src="/img/mastercard.png" alt="Mastercard" fill className="object-contain" />
                            </div>
                            <div className="relative w-8 h-5">
                                <Image src="/img/amex.png" alt="Amex" fill className="object-contain" />
                            </div>
                            <div className="relative w-8 h-5">
                                <Image src="/img/paypal.png" alt="Paypal" fill className="object-contain" />
                            </div>
                        </div>
                    </div>

                    {/* Made By */}
                    <div className="text-sm flex items-center gap-1.5">
                        <span className="text-slate-500">Made with </span>
                        <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
                        <span className="text-slate-500">by</span>
                        <a
                            href="https://sahadcse.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 font-semibold hover:text-primary-300 hover:underline transition-colors"
                        >
                            SAHADUZZAMAN
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}