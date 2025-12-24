'use client';

import { useState } from 'react';
import { ChevronDown, Mail, Phone, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// --- FAQ Data ---
const faqData = [
  {
    question: "How can I track my parcel?",
    answer: "You can easily track your parcel in real-time using our 'Tracking' page. Simply enter the Parcel ID provided at booking to view the current status, location, and estimated delivery time."
  },
  {
    question: "What are your delivery service areas?",
    answer: "We offer comprehensive delivery services across Bangladesh with next-day delivery in major cities like Dhaka, Chittagong, and Sylhet. Our nationwide coverage ensures reliable delivery to all districts within 2-4 business days."
  },
  {
    question: "How is the shipping cost calculated?",
    answer: "Shipping costs are calculated based on parcel weight, dimensions, and delivery destination. Use our instant 'Quote Calculator' to get an accurate estimate before booking."
  },
  {
    question: "What is Cash on Delivery (COD)?",
    answer: "Cash on Delivery (COD) allows the recipient to pay for goods upon receipt. We collect the payment and transfer it securely to the sender."
  },
  {
    question: "What items are prohibited?",
    answer: "We do not transport illegal substances, explosives, flammable materials, or hazardous goods. Please refer to our full Prohibited Items list for details."
  },
];

const AccordionItem = ({ question, answer, isOpen, onClick, index }: { question: string, answer: string, isOpen: boolean, onClick: () => void, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-xl mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary-500/30 bg-primary-50/50 dark:bg-slate-800/50' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className={`text-lg font-semibold transition-colors duration-300 ${isOpen ? 'text-primary-600' : 'text-slate-800 dark:text-slate-200'}`}>
          {question}
        </span>
        <span className={`rounded-full p-1 transition-all duration-300 ${isOpen ? 'bg-primary-100 text-primary-600 rotate-180' : 'bg-slate-100 text-slate-500'}`}>
          <ChevronDown size={20} />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-slate-50 dark:bg-slate-950 py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Header & Contact */}
          <div className="lg:w-1/3 space-y-8">
            <div className="space-y-4">
              <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">Support</span>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Frequently Asked <br /> <span className="text-primary-600">Questions</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Can't find what you're looking for? We're here to help you with any inquiries.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <HelpCircle className="text-primary-500" /> Need more help?
              </h3>
              <div className="space-y-4">
                <a href="tel:+8801746669174" className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors group">
                  <div className="p-3 rounded-full bg-white dark:bg-slate-900 text-primary-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Call anytime</p>
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">+880 174 666 9174</p>
                  </div>
                </a>

                <a href="#contact" className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors group">
                  <div className="p-3 rounded-full bg-white dark:bg-slate-900 text-primary-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email us</p>
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">support@procourier.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Accordion List */}
          <div className="lg:w-2/3">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                index={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
