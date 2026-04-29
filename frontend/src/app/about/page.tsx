'use client';

import { motion } from 'framer-motion';
import { Heart, Target, Users, Shield, PawPrint, CheckCircle2 } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <PublicNavbar />

      <main className="pt-32 pb-24">
        {/* Header */}
        <section className="px-6 lg:px-12 max-w-5xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              Empowering Pet Care <br /> Through <span className="text-gradient">Innovation</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              We believe that every pet deserves world-class care, and every pet owner deserves a seamless way to provide it.
            </p>
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="px-6 lg:px-12 max-w-7xl mx-auto mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-premium opacity-20 blur-3xl rounded-full"></div>
              <div className="glass-card p-2 relative z-10 aspect-square overflow-hidden rounded-[2.5rem]">
                <img 
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Happy dogs running" 
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Our Mission & Vision</h2>
              <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400">
                <p>
                  Founded by a team of passionate veterinarians and technologists, <strong>PetCare Shop</strong> was born out of a simple realization: managing a pet's health, diet, and appointments was too fragmented.
                </p>
                <p>
                  Our vision is to build a unified ecosystem where pet owners, top-tier veterinarians, and quality sellers converge. We integrate advanced AI to provide instant support, while keeping the human touch where it matters most.
                </p>
                <ul className="space-y-3 pt-4">
                  {[
                    "Unified pet health records",
                    "Seamless appointment scheduling",
                    "Trusted marketplace for premium goods",
                    "24/7 AI-powered health assistance"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal-500" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white dark:bg-slate-900 py-24">
          <div className="px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why choose PetCare Shop?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Designed with benefits for everyone in the pet care lifecycle.</p>
            </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Heart,
                  title: "For Pet Owners",
                  color: "pink",
                  desc: "Say goodbye to scattered vet papers. Keep track of vaccines, book trusted doctors instantly, and buy top-quality food from a single dashboard."
                },
                {
                  icon: Target,
                  title: "For Doctors",
                  color: "indigo",
                  desc: "Expand your practice. Manage your schedule effortlessly, access patient histories securely, and consult via our modern portal."
                },
                {
                  icon: Users,
                  title: "For Sellers",
                  color: "teal",
                  desc: "Reach a highly targeted audience of dedicated pet parents. Our seller dashboard makes inventory and order management a breeze."
                }
              ].map((role, idx) => (
                <motion.div 
                  key={idx} 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className="glass-card p-8 border-t-4 border-t-transparent hover:border-t-indigo-500 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-${role.color}-100 dark:bg-${role.color}-900/30 text-${role.color}-600 dark:text-${role.color}-400 flex items-center justify-center mb-6`}>
                    <role.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{role.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{role.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
