'use client';

import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "@/lib/api";
import { addToast } from "@/lib/toastSlice";

export default function ContactSection() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/contact', formData);
            dispatch(addToast({ message: "Message sent! We'll get back to you soon.", type: "success" }));
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to send message. Please try again.";
            dispatch(addToast({ message: errorMessage, type: "error" }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="relative py-24 bg-slate-900 overflow-hidden">
            {/* Background Map Effect */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-cover mix-blend-overlay"></div>

            <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary-500 font-bold tracking-wider uppercase text-sm">Get in Touch</span>
                    <h2 className="text-4xl font-bold text-white mt-2 mb-4">Contact Our Team</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Have a question or need a custom quote? Our logistics experts are ready to help you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Info Cards */}
                    <div className="space-y-8">
                        <ContactCard
                            icon={<MapPin className="text-primary-500" size={24} />}
                            title="Headquarters"
                            content="Mirpur 10, Dhaka 1216, Bangladesh"
                            subContent="Open Mon-Fri, 9am - 6pm"
                        />
                        <ContactCard
                            icon={<Phone className="text-primary-500" size={24} />}
                            title="Phone Support"
                            content="+880 174 666 9174"
                            subContent="24/7 Customer Hotline"
                        />
                        <ContactCard
                            icon={<Mail className="text-primary-500" size={24} />}
                            title="Email Inquiries"
                            content="sahaduzzaman.cse@gmail.com"
                            subContent="We reply within 2 hours"
                        />
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Shipment Inquiry"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="How can we help you..."
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ContactCard({ icon, title, content, subContent }: { icon: React.ReactNode, title: string, content: string, subContent: string }) {
    return (
        <div className="flex items-start gap-6 p-6 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 shadow-lg">
                {icon}
            </div>
            <div>
                <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
                <p className="text-primary-400 font-medium mb-1">{content}</p>
                <p className="text-slate-500 text-sm">{subContent}</p>
            </div>
        </div>
    )
}
