'use client';

import { motion } from 'framer-motion';
import { 
  PawPrint, CalendarCheck, Stethoscope, MessageSquareHeart, 
  ArrowRight, ShieldCheck, ShoppingBag, Star, Activity, UserPlus, Search 
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import Footer from '@/components/Footer';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans selection:bg-indigo-500/30">
      <PublicNavbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-blob" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-4xl mt-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-8 border border-indigo-100 dark:border-indigo-500/20">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
              Introducing PetCare Shop 2.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 tracking-tight leading-[1.1] mb-8">
              Smart Pet Care <br className="hidden md:block" />
              <span className="text-gradient">Starts Here</span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The ultimate all-in-one platform for your furry friends. Connect with top veterinarians, shop premium products, and manage your pet's health with AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="inline-flex items-center justify-center whitespace-nowrap font-semibold h-14 px-8 text-base bg-gradient-premium hover:opacity-90 text-white rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:pr-6 group">
                Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="inline-flex items-center justify-center whitespace-nowrap font-semibold h-14 px-8 text-base rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-900 dark:text-white backdrop-blur-sm">
                Explore Features
              </Link>
            </div>
          </motion.div>

          {/* Hero Image Mockup (Conceptual) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-5xl mx-auto mt-20 relative z-10"
          >
            <div className="glass-card p-2 md:p-4 rounded-[2rem] md:rounded-[2.5rem]">
              <div className="bg-slate-100 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-inner aspect-[16/9] relative flex items-center justify-center group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-[0.02]"></div>
                <img 
                  src="/hero-dashboard.png" 
                  alt="Pet Care Dashboard Mockup" 
                  className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-white dark:bg-slate-900/50 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Everything you need, in one place.</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                A unified ecosystem designed to make pet parenting easier, safer, and more enjoyable.
              </p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                { icon: Activity, title: "Pet Management", desc: "Keep track of vaccinations, medical history, and daily activities in a beautiful dashboard.", color: "indigo" },
                { icon: CalendarCheck, title: "Doctor Appointments", desc: "Book trusted local veterinarians instantly. No more waiting on hold.", color: "purple" },
                { icon: MessageSquareHeart, title: "AI Chatbot", desc: "Get instant, 24/7 answers to your pet care questions powered by advanced AI.", color: "pink" },
                { icon: ShoppingBag, title: "Premium Marketplace", desc: "Shop curated food, toys, and accessories from verified sellers.", color: "teal" },
                { icon: ShieldCheck, title: "Seller System", desc: "Become a seller and reach thousands of pet owners looking for quality products.", color: "blue" },
                { icon: Stethoscope, title: "Vet Portal", desc: "Dedicated tools for veterinarians to manage appointments and patient records.", color: "rose" }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants as any} className="glass-card p-8 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent dark:from-indigo-900/10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">How it works</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
                  Get started in minutes. Our intuitive platform guides you through every step of your pet care journey.
                </p>

                <div className="space-y-8">
                  {[
                    { icon: UserPlus, title: "1. Create an Account", desc: "Sign up for free and set up your personalized profile in seconds." },
                    { icon: PawPrint, title: "2. Add Your Pets", desc: "Create profiles for your pets, add their photos, and input medical history." },
                    { icon: Search, title: "3. Book & Shop", desc: "Find top-rated vets, book appointments, or shop for premium pet supplies." }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-6 items-start">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-200 dark:border-indigo-800">
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-teal-500/20 blur-3xl rounded-full" />
                <div className="glass-card p-6 relative z-10">
                  <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl border-2 border-indigo-500">🐶</div>
                      <div>
                        <h3 className="text-xl font-bold">Max (Golden Retriever)</h3>
                        <p className="text-slate-400">3 Years Old • Healthy</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-slate-800 rounded-xl">
                        <span className="text-slate-300">Upcoming Vaccination</span>
                        <span className="text-teal-400 font-medium">In 2 weeks</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-slate-800 rounded-xl">
                        <span className="text-slate-300">Vet Appointment</span>
                        <span className="text-indigo-400 font-medium">Tomorrow, 10 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DOCTOR HIGHLIGHT & MARKETPLACE PREVIEW */}
        <section className="py-24 bg-slate-900 text-white relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Expert Care & Premium Products</h2>
                <p className="text-lg text-slate-300">
                  Connect with verified professionals and shop high-quality items for your pets.
                </p>
              </div>
              <div className="flex gap-4">
                <ButtonLink href="/doctors" text="View Doctors" variant="outline" />
                <ButtonLink href="/shop" text="Visit Shop" variant="primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Doctor Card */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 bg-slate-700 rounded-full mb-4 border-2 border-indigo-500 overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=DrSmith&backgroundColor=b6e3f4" alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-1">Dr. Sarah Smith</h3>
                <p className="text-indigo-400 text-sm mb-4">Lead Veterinarian</p>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-slate-400 ml-2">(120)</span>
                </div>
              </div>

              {/* Doctor Card */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 bg-slate-700 rounded-full mb-4 border-2 border-teal-500 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=DrJohn&backgroundColor=c0aede" alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-1">Dr. John Doe</h3>
                <p className="text-teal-400 text-sm mb-4">Surgeon Specialist</p>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4" />
                  <span className="text-slate-400 ml-2">(85)</span>
                </div>
              </div>

              {/* Product Card */}
              <div className="bg-white text-slate-900 p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-full aspect-square bg-slate-100 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="text-4xl">🦴</div>
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">New</div>
                </div>
                <h3 className="text-lg font-bold mb-1">Premium Dog Bone</h3>
                <p className="text-slate-500 text-sm mb-4">Healthy & Organic</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-slate-900">$24.99</span>
                  <button className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors">+</button>
                </div>
              </div>

              {/* Product Card */}
              <div className="bg-white text-slate-900 p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-full aspect-square bg-slate-100 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="text-4xl">🧶</div>
                </div>
                <h3 className="text-lg font-bold mb-1">Cat Toy Set</h3>
                <p className="text-slate-500 text-sm mb-4">Interactive Fun</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-slate-900">$15.50</span>
                  <button className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-16">Loved by pet parents everywhere.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { name: "Emily R.", role: "Dog Owner", text: "This platform completely changed how I manage my dog's health. Booking a vet is so easy now!" },
                { name: "Michael T.", role: "Cat Parent", text: "The AI chatbot saved me a trip to the clinic in the middle of the night. Highly recommended." },
                { name: "Sarah L.", role: "Pet Seller", text: "As a seller, the marketplace UI is gorgeous and easy to use. My sales have doubled since joining." }
              ].map((testimonial, idx) => (
                <div key={idx} className="glass-card p-8">
                  <div className="flex items-center gap-1 text-yellow-400 mb-6">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-lg mb-8 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="bg-gradient-premium rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl"></div>
              
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 relative z-10">Join Pet Care Shop Today</h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto relative z-10">
                Experience the future of pet care. Sign up now and give your furry friend the premium treatment they deserve.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <Link href="/register" className="inline-flex items-center justify-center whitespace-nowrap font-bold h-14 px-8 text-lg bg-white text-indigo-600 hover:bg-slate-50 rounded-full transition-all shadow-xl hover:scale-105">
                  Create Free Account
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap font-bold h-14 px-8 text-lg border-2 border-white text-white hover:bg-white/10 rounded-full transition-all">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Simple helper for buttons in dark section
function ButtonLink({ href, text, variant }: { href: string, text: string, variant: 'primary' | 'outline' }) {
  const base = "inline-flex items-center justify-center whitespace-nowrap font-semibold h-12 px-6 rounded-full transition-all";
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25",
    outline: "border border-slate-600 hover:bg-slate-800 text-white"
  };
  return (
    <Link href={href} className={`${base} ${variants[variant]}`}>
      {text}
    </Link>
  );
}
