'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X } from 'lucide-react';

// --- Navigation Links Configuration ---
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Tracking', href: '#tracking' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
  { label: 'Login', href: '/login', isExternal: true }, // Mark external links
];

// --- Header Component with Mobile Menu ---
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // --- Smooth Scroll Logic ---
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id.substring(1)); // Remove '#' from id
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjust offset for header height
        behavior: 'smooth',
      });
    }
    setIsMenuOpen(false); // Close mobile menu on click
  };
  
  // --- Scroll Detection for Header Style ---
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
      
      // Update active section based on scroll position
      const sections = navLinks.map(link => document.getElementById(link.href.substring(1))).filter(Boolean);
      let currentSection = 'home';
      for (const section of sections) {
        if (section && section.offsetTop <= window.scrollY + 100) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        hasScrolled ? 'bg-black shadow-lg text-white' : 'bg-transparent'
      }`}
    >
      {/* Top Bar */}
      <div className={`border-b border-white/10 bg-black text-xs transition-all duration-300 ${
          hasScrolled ? 'max-h-0 py-0 opacity-0 overflow-hidden' : 'max-h-20 opacity-100 py-2'
        }`}
      >
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 text-gray-300 sm:flex-row sm:gap-0">
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">SITEMAP</Link>
            <span>|</span>
            <Link href="#" className="hover:text-white">PRIVACY</Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="tel:+8801746669174" className="flex items-center gap-2 hover:text-white">
              <Phone size={14} />
              <span className="hidden md:inline">CALL US NOW: </span><span className='text-yellow-400'>+880 1746669174</span>
            </a>
            <Link href="#faq" className="rounded bg-yellow-500 px-4 py-1.5 font-bold text-slate-900 transition-colors hover:bg-yellow-400">
              FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-t border-white/10 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-3xl font-bold">
            Pro<span className="text-yellow-500">Courier</span>→
          </Link>
          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
                link.isExternal ? (
                    <Link key={link.label} href={link.href} className={`text-sm font-semibold uppercase tracking-wider transition-colors ${hasScrolled ? "text-white hover:text-yellow-500" : "text-gray-300 hover:text-yellow-500"}`}>
                        {link.label}
                    </Link>
                ) : (
                    <a key={link.label} href={link.href} onClick={(e) => handleScrollTo(e, link.href)} className={`text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        activeSection === link.href.substring(1) ? 'text-yellow-500' : (hasScrolled ? 'text-white hover:text-yellow-500' : 'text-gray-300 hover:text-yellow-500')
                    }`}>
                        {link.label}
                    </a>
                )
            ))}
          </div>
          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className={`${hasScrolled ? 'text-white' : 'text-white'}`}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-700 p-4">
            <Link href="/" className="text-3xl font-bold text-white">
              Pro<span className="text-yellow-500">Courier</span>→
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 p-8 text-center flex-grow">
            {navLinks.map((link) => (
              link.isExternal ? (
                <Link key={link.label} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold uppercase tracking-wider text-gray-200 hover:text-yellow-500">
                    {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} onClick={(e) => handleScrollTo(e, link.href)} className={`text-lg font-semibold uppercase tracking-wider transition-colors ${activeSection === link.href.substring(1) ? 'text-yellow-500' : 'text-gray-200 hover:text-yellow-500'}`}>
                  {link.label}
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
