'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Search, Menu, X } from 'lucide-react';




// --- Header Component with Mobile Menu ---
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
  const navLinks = ['Home', 'About', 'Tracking', 'Pricing', 'Contact', 'Blog', 'Login'];

   // --- FIX #2: Add an effect to detect page scroll ---
  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if user has scrolled more than 10px
      setHasScrolled(window.scrollY > 10);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
        hasScrolled ? 'bg-black shadow-lg text-white' : 'bg-transparent'
      }`}
    >
      {/* Top Bar */}
      <div className={`border-b border-white/10 bg-black  text-xs transition-all duration-300 ${
          hasScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-20 opacity-100 py-2'
      }`}>
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 text-gray-300 sm:flex-row sm:gap-0">
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">SITEMAP</Link>
            <span>|</span>
            <Link href="#" className="hover:text-white">PRIVACY</Link>
            <span>|</span>
            <Link href="#" className="hover:text-white">PRICING</Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="tel:+8801746669174" className="flex items-center gap-2 hover:text-white">
              <Phone size={14} />
              <span className="hidden md:inline">CALL US NOW: </span><span className='text-yellow-400'>+880 1746669174</span>
            </Link>
            <Link href="/login" className="rounded bg-yellow-500 px-4 py-1.5 font-bold text-slate-900 transition-colors hover:bg-yellow-400">
              SIGN IN
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-t border-b border-white/10 backdrop-blur-lg ">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-3xl font-bold">
            Pro<span className="text-yellow-500">Courier</span>→
          </Link>
          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link key={link} href="/login" className={`text-sm font-semibold uppercase tracking-wider transition-colors ${link === 'Home' ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500' } ${
        hasScrolled ? "text-white" : "text-gray-600"
      }`}>
                {link}
              </Link>
            ))}
            <button className="text-gray-600 hover:text-yellow-500"><Search size={18} /></button>
          </div>
          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className={`text-black ${
        hasScrolled ? ' text-white' : 'bg-transparent'
      }`}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-700 p-4">
            <Link href="/" className="text-3xl font-bold">
              Pro<span className="text-yellow-500">Courier</span>→
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
            {navLinks.map((link) => (
              <Link key={link} href="#" onClick={() => setIsMenuOpen(false)} className={`text-lg font-semibold uppercase tracking-wider transition-colors ${link === 'Home' ? 'text-yellow-500' : 'text-gray-200 hover:text-yellow-500'}`}>
                {link}
              </Link>
            ))}
            <button className="mt-4 text-gray-200 hover:text-yellow-500"><Search size={24} /></button>
          </div>
        </div>
      )}
    </header>
  );
}