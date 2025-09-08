'use client'

import { MapPin, Phone, Mail } from "lucide-react";



export default function ContactSection() {
    return (
        <section className="bg-gray-800 py-16 text-white sm:py-24">
            <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-2">
                <div>
                    <h2 className="text-3xl font-bold">CONTACT US</h2>
                    <form className="mt-6 space-y-4">
                        <input type="text" placeholder="Your Name" className="w-full rounded border-none bg-gray-700 p-3" />
                        <input type="email" placeholder="Email Address" className="w-full rounded border-none bg-gray-700 p-3" />
                        <input type="text" placeholder="Subject" className="w-full rounded border-none bg-gray-700 p-3" />
                        <textarea placeholder="Your Message" rows={5} className="w-full rounded border-none bg-gray-700 p-3"></textarea>
                        <button type="submit" className="w-full rounded bg-yellow-500 py-3 font-semibold text-slate-900">SEND MESSAGE</button>
                    </form>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Contact Information</h3>
                    <div className="flex items-start gap-4">
                        <MapPin size={24} className="mt-1 text-yellow-500" />
                        <div>
                            <strong>Address:</strong>
                            <p className="text-gray-400">Mirpur, Dhaka, Bangladesh</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Phone size={24} className="mt-1 text-yellow-500" />
                        <div>
                            <strong>Phone:</strong>
                            <p className="text-gray-400">+880 1746669174</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Mail size={24} className="mt-1 text-yellow-500" />
                        <div>
                            <strong>Email:</strong>
                            <p className="text-gray-400">sahaduzzaman.cse@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}