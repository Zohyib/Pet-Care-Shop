'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <PublicNavbar />

      <main className="pt-32 pb-24">
        <section className="px-6 lg:px-12 max-w-7xl mx-auto mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4"
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              Have a question about our services, need help with your account, or want to partner with us? Our team is here to help.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="glass-card p-8 bg-gradient-premium text-white h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                
                <h3 className="text-2xl font-bold mb-8 relative z-10">Contact Information</h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Our Location</h4>
                      <p className="text-indigo-100">123 Pet Care Lane,<br />Innovation City, PC 90210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Phone Number</h4>
                      <p className="text-indigo-100">+1 (555) 123-4567<br />Mon-Fri, 9am-6pm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Email Address</h4>
                      <p className="text-indigo-100">support@petcareshop.com<br />partners@petcareshop.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="glass-card p-8 md:p-10">
                {isSubmitted ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent Successfully!</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                      Thank you for reaching out to us. Our team will review your message and get back to you within 24 hours.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                      <select 
                        id="subject" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                      >
                        <option>General Inquiry</option>
                        <option>Support Request</option>
                        <option>Partnership Opportunity</option>
                        <option>Feedback</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                      <textarea 
                        id="message" 
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-slate-900 dark:text-white"
                        placeholder="How can we help you today?"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
