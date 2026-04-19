'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PawPrint, Calendar, LogOut, Plus, Activity, User as UserIcon, MessageSquare, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, token } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  const { data: pets, isLoading: ptLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const res = await api.get('/pets/my-pets');
      return res.data;
    },
    enabled: !!token && user?.role === 'USER',
  });

  const { data: appointments, isLoading: aptLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await api.get('/appointments/my-appointments');
      return res.data;
    },
    enabled: !!token,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 sm:p-12">
      <header className="flex items-center justify-between mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white">
            <PawPrint className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pet Care Shop</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.email}</p>
              <p className="text-xs text-slate-500 uppercase">{user.role}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push('/ai-vet')} className="border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-900/50">
             <Bot className="w-4 h-4 mr-2" /> AI Assistant
          </Button>
          <Button variant="outline" onClick={() => router.push('/chat')} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
            <MessageSquare className="w-4 h-4 mr-2" /> Open Chat
          </Button>
          <Button variant="outline" onClick={() => { logout(); router.push('/login'); }}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {user.role === 'DOCTOR' 
              ? "Here's an overview of your schedule and patients today."
              : "Manage your pets, book appointments, and connect with veterinarians."
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* USER SPECIFIC UI */}
          {user.role === 'USER' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <PawPrint className="text-indigo-500" /> My Pets
                </h3>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Pet
                </Button>
              </div>

              {ptLoading ? (
                <div className="h-40 flex items-center justify-center text-slate-500">Loading pets...</div>
              ) : pets?.length === 0 ? (
                <Card className="border-dashed border-2 shadow-none bg-slate-50/50 dark:bg-slate-900/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <PawPrint className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-slate-600 font-medium">You haven't added any pets yet.</p>
                    <p className="text-sm text-slate-500 mt-1">Add your first pet to start tracking their health.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pets?.map((pet: any) => (
                    <Card key={pet.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          {pet.name}
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{pet.breed || 'Mixed'}</span>
                        </CardTitle>
                        <CardDescription>{pet.age ? `${pet.age} years old` : 'Age unknown'}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* DOCTOR SPECIFIC UI */}
          {user.role === 'DOCTOR' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Activity className="text-indigo-500" /> Recent Patients
                </h3>
              </div>
              <Card className="border-dashed border-2 shadow-none p-12 text-center text-slate-500">
                Patient history functionality from backend will appear here.
              </Card>
            </motion.div>
          )}

          {/* APPOINTMENTS (SHARED) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="text-indigo-500" /> Appointments
              </h3>
              {user.role === 'USER' && (
                <Button variant="outline" size="sm">Book New</Button>
              )}
            </div>

            <div className="space-y-4">
              {aptLoading ? (
                 <div className="text-center text-slate-500 py-8">Loading appointments...</div>
              ) : appointments?.length === 0 ? (
                 <Card className="bg-slate-50 border-none shadow-none text-center py-8">
                   <p className="text-sm text-slate-500">No upcoming appointments</p>
                 </Card>
              ) : (
                appointments?.map((apt: any) => (
                  <Card key={apt.id} className="border-l-4 border-l-indigo-500 shadow-sm">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base flex justify-between">
                        {new Date(apt.date).toLocaleDateString()}
                        <span className={`text-xs px-2 py-1 rounded-xl ${apt.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                          {apt.status}
                        </span>
                      </CardTitle>
                      <CardDescription className="text-sm mt-2">
                        {user.role === 'USER' ? `Dr. ${apt.doctor?.name || 'Assigned'}` : `Pet: ${apt.pet?.name || 'Unknown'}`}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
          
        </div>
      </main>
    </div>
  );
}
