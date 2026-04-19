'use client';

import { motion } from 'framer-motion';
import { PawPrint, CalendarCheck, Stethoscope, MessageSquareHeart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      
      {/* Navigation */}
      <nav className="w-full absolute top-0 z-50 px-6 py-6 lg:px-12 flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <PawPrint className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Pet Care Shop</span>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 h-9 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 rounded-full px-6 active:scale-95">
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 tracking-tight leading-[1.1] mb-8">
            The intelligent ecosystem for your pet's life.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with top veterinarians, book appointments instantly, and leverage AI to monitor your pet's health. Premium care, zero friction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center justify-center whitespace-nowrap font-medium h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:pr-6 group">
              Start for free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="inline-flex items-center justify-center whitespace-nowrap font-medium h-14 px-8 text-base rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-900 dark:text-white">
              Explore features
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div id="features" className="w-full relative z-10 mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6">
              <CalendarCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Booking</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Schedule visits instantly. Our intelligent calendar prevents double bookings and manages timezones seamlessly.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6">
              <Stethoscope className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Top Veterinarians</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect with verified doctors. Share secure medical histories and view active prescriptions instantly.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquareHeart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Powered</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Get 24/7 AI-driven pet care advice, symptom checking, and smart reminders for vaccinations.
            </p>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
