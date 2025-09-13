'use client';

import { useState } from 'react';
import { ChevronDown, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

// --- FAQ Data ---
const faqData = [
  {
    question: "How can I track my parcel?",
    answer: "You can easily track your parcel in real-time. Simply go to our homepage or the 'Tracking' section, enter the Parcel ID provided to you at the time of booking, and you will see the current status and location of your shipment."
  },
  {
    question: "What are your delivery service areas?",
    answer: "We offer comprehensive delivery services across Bangladesh. Our primary hubs are in major cities like Dhaka, Chittagong, and Sylhet, allowing for next-day delivery within these zones. We also provide reliable nationwide coverage for all other districts, which may take 2-4 business days."
  },
  {
    question: "How is the shipping cost calculated?",
    answer: "The shipping cost is calculated based on three main factors: the parcel's size (small, medium, large), its weight, and the delivery destination (inside Dhaka, Dhaka subcontinent, or nationwide). You can get an instant price estimate using the 'Quote Calculator' on our homepage."
  },
  {
    question: "What is Cash on Delivery (COD) and how does it work?",
    answer: "Cash on Delivery (COD) is a payment method where the recipient pays for the goods at the time of delivery, rather than in advance. Our delivery agent collects the specified amount from the recipient, and we then transfer the funds to you, the sender, through your preferred payment method."
  },
  {
    question: "What should I do if my parcel is delayed or lost?",
    answer: "While we strive for timely delivery, unforeseen circumstances can cause delays. If your parcel has not arrived within the estimated timeframe, please contact our customer support immediately with your Parcel ID. We will launch an investigation to locate your shipment and provide you with a prompt update."
  },
  {
    question: "Are there any items that are prohibited from shipping?",
    answer: "Yes, for safety and legal reasons, we cannot transport certain items. This includes illegal substances, flammable materials, explosives, currency, liquids, and other hazardous goods. Please review our detailed prohibited items list on our website before booking a parcel."
  },
];


// --- Accordion Item Component ---
const AccordionItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 text-left text-lg font-semibold text-gray-800 dark:text-white"
      >
        <span className='text-md'>{question}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={24}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
            <p className="pb-5 text-gray-600 dark:text-gray-400">{answer}</p>
        </div>
      </div>
    </div>
  );
};

// --- Main FAQ Section Component ---
export default function FaqSection() {
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Find answers to common questions about our services.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openQuestionIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* "Still Have Questions?" Section */}
        <div className="mt-20 text-center rounded-lg bg-gray-50 dark:bg-gray-800 p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Still have questions?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            If you can&apos;t find the answer you&apos;re looking for, please get in touch with our support team.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+8801746669174"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              <Phone size={18} /> Call Us Now
            </a>
            <Link
              href="/#contact"
              className="flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-gray-800 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600"
            >
              <Mail size={18} /> Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
