'use client';

// ... (imports)
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useAppSelector } from "@/lib/store";
import { Phone, Menu, X, Globe, Lock, MapPin, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Navigation Links Configuration ---
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Tracking', href: '#tracking' },
  { label: 'Booking', href: '#booking' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const isHome = pathname === '/';

  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin': return '/admin';
      case 'agent': return '/agent';
      case 'customer': return '/customer';
      default: return '/login';
    }
  };

  const dashboardLink = getDashboardLink();

  // --- Smooth Scroll Logic ---
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!isHome) return; // Should not happen if logic is correct, but safety first
    e.preventDefault();
    const element = document.getElementById(id.substring(1));
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    }
    setIsMenuOpen(false);
  };

  // --- Scroll Detection ---
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);

      // Update active section
      const sections = navLinks
        .map(link => document.getElementById(link.href.substring(1)))
        .filter((el): el is HTMLElement => el !== null);

      // Sort by position so we always find the correct "current" section regardless of DOM order vs Menu order
      sections.sort((a, b) => a.offsetTop - b.offsetTop);

      let currentSection = 'home';
      for (const section of sections) {
        if (window.scrollY >= (section.offsetTop - 150)) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Always show background on non-home pages
  const headerBgClass = !isHome || hasScrolled
    ? 'bg-slate-900/90 backdrop-blur-md shadow-lg py-2'
    : 'bg-transparent py-2';

  // Always hide top bar on non-home pages (optional preference, assuming scroll state behavior)
  // Actually, let's keep top bar logic consistent with scroll or just hide it on other pages?
  // User didn't specify, but "hasScrolled" logic applies to 'Home'. 
  // Let's force 'hasScrolled' visual state if not home for consistency.
  const isScrolledState = !isHome || hasScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${headerBgClass}`}
    >
      {/* Top Bar - Hidden on scroll for cleanliness */}
      <div className={`overflow-hidden transition-all duration-300  border-b border-white/10 ${isScrolledState ? 'h-0 opacity-0' : 'h-6 opacity-100'
        }`}
      >
        <div className="container mx-auto max-w-[1280px] flex items-center justify-between px-6 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Globe size={12} /> Global Shipping</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="flex items-center gap-1"><Lock size={12} /> Secure Logistics</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+8801746669174" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
              <Phone size={12} />
              <span>+880 174 666 9174</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin size={12} />
              <span>Dhaka, Bangladesh</span>
            </div>

          </div>
        </div>
      </div>

      <nav className="container mx-auto max-w-[1280px] px-6 mt-2">
        <div className="flex items-center justify-between">
          {/* Logo */}

          <Link href="/" className="group flex flex-col items-center leading-none">
            <div className="w-full h-[2px] bg-white mb-1 transition-colors group-hover:bg-primary-400"></div>
            <span className="text-2xl font-bold tracking-wider text-white transition-colors group-hover:text-primary-400">COURIER-S</span>
            <div className="flex items-center w-full gap-2 mt-1">
              <div className="h-[2px] flex-1 bg-white transition-colors group-hover:bg-primary-400"></div>
              <span className="text-[10px] font-bold tracking-widest text-white transition-colors group-hover:text-primary-400">PRO</span>
              <div className="h-[2px] flex-1 bg-white transition-colors group-hover:bg-primary-400"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 backdrop-blur-sm border border-white/5">
            {navLinks.map((link) => {
              const href = isHome ? link.href : `/${link.href}`;
              const isActive = isHome && activeSection === link.href.substring(1);

              return (
                <li key={link.label}>
                  <Link
                    href={href as any}
                    onClick={(e) => isHome ? handleScrollTo(e as any, link.href) : null}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full duration-300 ${isActive
                      ? 'text-white bg-primary-600 shadow-md shadow-primary-900/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA Button & Login */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                href={dashboardLink}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white/90 hover:text-white transition-colors relative group"
              >
                <LayoutDashboard size={16} />
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-white/90 hover:text-white transition-colors relative group"
              >
                Login
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
            <Link
              href={isHome ? "#quote" : "/#quote"}
              onClick={(e) => isHome ? handleScrollTo(e as any, '#quote') : null}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg shadow-lg shadow-accent-500/20 hover:shadow-accent-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] flex flex-col bg-slate-900/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="text-2xl font-bold text-white">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 overflow-y-auto">
              {navLinks.map((link, index) => {
                const href = isHome ? link.href : `/${link.href}`;
                const isActive = isHome && activeSection === link.href.substring(1);

                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={href as any}
                      onClick={(e) => {
                        if (isHome) {
                          handleScrollTo(e as any, link.href);
                        } else {
                          setIsMenuOpen(false);
                        }
                      }}
                      className={`text-2xl font-semibold tracking-wide ${isActive ? 'text-primary-400' : 'text-slate-200'}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col w-full gap-4"
              >
                {isAuthenticated ? (
                  <Link
                    href={dashboardLink}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-4 text-center rounded-xl bg-slate-800 text-white font-semibold border border-white/10 flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={20} /> Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="w-full py-4 text-center rounded-xl bg-slate-800 text-white font-semibold border border-white/10"
                  >
                    Login
                  </Link>
                )}
                <Link
                  href={isHome ? "#quote" : "/#quote"}
                  onClick={(e) => {
                    if (isHome) {
                      handleScrollTo(e as any, '#quote');
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                  className="w-full py-4 text-center rounded-xl bg-primary-600 text-white font-semibold shadow-xl shadow-primary-600/20"
                >
                  Get a Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
