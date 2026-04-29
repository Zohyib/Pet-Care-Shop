'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, MapPin, Building2, Stethoscope, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function DoctorDiscoveryPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', search, specialty],
    queryFn: async () => {
      const res = await api.get('/doctors', {
        params: { search, specialty }
      });
      return res.data;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Find Your Pet's <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Perfect Vet</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Discover and book appointments with top-rated veterinarians near you.
          </motion.p>
        </div>

        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Search by doctor name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select 
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full pl-10 h-12 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
            >
              <option value="">All Specialties</option>
              <option value="Surgery">Surgery</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Nutrition">Nutrition</option>
              <option value="General">General Practice</option>
            </select>
          </div>
        </motion.div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : doctors?.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Stethoscope className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-xl">No doctors found matching your criteria.</p>
          </div>
        ) : (
          <motion.div 
             initial="hidden" animate="show"
             variants={{
               hidden: { opacity: 0 },
               show: { opacity: 1, transition: { staggerChildren: 0.1 } }
             }}
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Array.isArray(doctors) ? doctors.map((doc: any) => (
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }}}
                key={doc.id} 
                className="glass-card overflow-hidden hover:scale-[1.02] transition-all duration-300 group flex flex-col border-none"
              >
                <div className="p-6 flex gap-4 items-start border-b border-slate-100 dark:border-slate-800">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900 shrink-0 flex items-center justify-center overflow-hidden">
                    {doc.avatarUrl ? (
                      <img src={doc.avatarUrl} alt={doc.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-10 h-10 text-indigo-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">
                      Dr. {doc.name}
                    </h3>
                    <p className="text-sm font-medium text-indigo-500">{doc.doctorProfile?.mainSpecialization}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{doc.doctorProfile?.calculatedRating?.toFixed(1) || 'New'}</span>
                      <span>({doc.doctorProfile?.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{doc.doctorProfile?.clinicName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{doc.doctorProfile?.locationCity}, {doc.doctorProfile?.locationCountry}</span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-4">
                    {doc.doctorProfile?.bio || "Experienced veterinary professional dedicated to pet well-being."}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 mt-auto flex items-center justify-between">
                  <div className="font-bold text-slate-800 dark:text-white">
                    ${doc.doctorProfile?.consultationFee} <span className="text-xs font-normal text-slate-500">/visit</span>
                  </div>
                  <Button onClick={() => router.push(`/doctors/${doc.id}`)} className="bg-gradient-premium hover:opacity-90 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/25">
                    View Profile <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center text-red-500 font-medium p-8 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800">
                Data structure error: Expected an array of doctors, but received: <br/> 
                <span className="font-mono text-xs text-slate-500 mt-2 block">{JSON.stringify(doctors)}</span>
                <p className="mt-4 text-slate-800 dark:text-slate-200">Please restart your <strong className="text-black dark:text-white">Backend</strong> terminal so it uses the newly compiled codebase.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
