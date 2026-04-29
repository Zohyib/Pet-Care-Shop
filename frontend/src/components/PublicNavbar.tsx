'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-premium p-2 rounded-xl text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <PawPrint className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              PetCare<span className="text-indigo-600 dark:text-indigo-400">Shop</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    pathname === link.href ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-700 pl-6">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all h-10 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-full px-6 shadow-lg shadow-slate-900/20 dark:shadow-white/10 hover:scale-105"
              >
                Sign Up Free
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-white dark:bg-slate-950 px-6 py-5 md:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="bg-gradient-premium p-2 rounded-xl text-white">
                  <PawPrint className="w-6 h-6" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  PetCare<span className="text-indigo-600 dark:text-indigo-400">Shop</span>
                </span>
              </Link>
              <button
                className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 rounded-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-2xl font-bold text-slate-800 dark:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-4" />
              
              <Link
                href="/login"
                className="text-xl font-bold text-slate-800 dark:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center whitespace-nowrap text-lg font-bold transition-all h-14 w-full bg-indigo-600 text-white rounded-full mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up for Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
