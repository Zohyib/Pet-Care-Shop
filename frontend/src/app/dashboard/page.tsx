'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PawPrint, Calendar, LogOut, Plus, Activity, User as UserIcon, MessageSquare, Bot, Check, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, token } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetImage, setNewPetImage] = useState('');
  const [isSubmittingPet, setIsSubmittingPet] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image using canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setNewPetImage(canvas.toDataURL('image/jpeg', 0.7)); // compresses image
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Doctor Action State
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editPrescriptions, setEditPrescriptions] = useState('');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  const { data: pets, isLoading: ptLoading, refetch: refetchPets } = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const res = await api.get('/pets/my-pets');
      return res.data;
    },
    enabled: !!token && user?.role === 'USER',
  });

  const { data: appointments, isLoading: aptLoading, refetch: refetchAppointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await api.get('/appointments/my-appointments');
      return res.data;
    },
    enabled: !!token,
  });

  const { data: myProfile } = useQuery({
    queryKey: ['my-profile-dashboard'],
    queryFn: async () => {
      const res = await api.get('/users/profile/me');
      return res.data;
    },
    enabled: !!token,
  });

  const handleAddPet = async () => {
    if (!newPetName) return toast.error('Pet name is required');
    setIsSubmittingPet(true);
    try {
      await api.post('/pets', {
        name: newPetName,
        breed: newPetBreed,
        age: newPetAge ? parseInt(newPetAge, 10) : null,
        imageUrl: newPetImage,
      });
      toast.success('Pet added successfully!');
      setIsAddPetModalOpen(false);
      setNewPetName('');
      setNewPetBreed('');
      setNewPetAge('');
      setNewPetImage('');
      refetchPets();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to add pet');
    } finally {
      setIsSubmittingPet(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment marked as ${status}`);
      refetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSaveDetails = async () => {
    setIsSavingDetails(true);
    try {
      await api.put(`/appointments/${editingAppointment.id}`, { 
        notes: editNotes, 
        prescriptions: editPrescriptions 
      });
      toast.success('Details saved successfully');
      setEditingAppointment(null);
      refetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save details');
    } finally {
      setIsSavingDetails(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <Navbar />
      <div className="p-6 sm:p-12">
        <main className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800/50 dark:to-indigo-900/20 border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2 relative z-10">
              Welcome back! 👋
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {['DOCTOR', 'VET'].includes(user.role) 
                ? "Here's an overview of your schedule and patients today."
                : "Manage your pets, book appointments, and connect with veterinarians."
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* USER SPECIFIC UI */}
            {user.role === 'USER' && (
              <>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <PawPrint className="text-indigo-500" /> My Pets
                    </h3>
                    <Button onClick={() => setIsAddPetModalOpen(true)} className="bg-gradient-premium hover:opacity-90 text-white shadow-lg shadow-indigo-500/25 rounded-xl">
                      <Plus className="w-4 h-4 mr-2" /> Add Pet
                    </Button>
                  </div>

                  {ptLoading ? (
                    <div className="h-40 flex items-center justify-center text-slate-500">Loading pets...</div>
                ) : pets?.length === 0 ? (
                  <Card className="glass-card border-dashed border-2 border-slate-200 dark:border-slate-700 shadow-none bg-slate-50/50 dark:bg-slate-900/50">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <PawPrint className="w-12 h-12 text-slate-300 mb-4" />
                      <p className="text-slate-600 font-medium">You haven't added any pets yet.</p>
                      <p className="text-sm text-slate-500 mt-1">Add your first pet to start tracking their health.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pets?.map((pet: any) => (
                      <Card key={pet.id} className="glass-card hover:scale-[1.02] transition-transform duration-300">
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              {pet.imageUrl ? (
                                <img src={pet.imageUrl} alt={pet.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                  <PawPrint className="w-5 h-5 text-slate-400" />
                                </div>
                              )}
                              <span>{pet.name}</span>
                            </div>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{pet.breed || 'Mixed'}</span>
                          </CardTitle>
                          <CardDescription className="ml-13">{pet.age ? `${pet.age} years old` : 'Age unknown'}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Calendar className="text-indigo-500" /> Appointments
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => router.push('/doctors')} className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Find Doctor</Button>
                </div>

                <div className="space-y-4">
                  {aptLoading ? (
                     <div className="text-center text-slate-500 py-8">Loading appointments...</div>
                  ) : appointments?.length === 0 ? (
                     <Card className="bg-slate-50 dark:bg-slate-800/50 border-none shadow-none text-center py-8">
                       <p className="text-sm text-slate-500">No upcoming appointments</p>
                     </Card>
                  ) : (
                    appointments?.map((apt: any) => (
                      <Card key={apt.id} className="glass-card border-l-4 border-l-indigo-500 shadow-sm hover:scale-[1.01] transition-transform duration-300">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base flex justify-between">
                            {new Date(apt.date).toLocaleDateString()}
                            <span className={`text-xs px-2 py-1 rounded-xl ${
                              apt.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 
                              apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                              apt.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-700 animate-pulse' :
                              apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {apt.status}
                            </span>
                          </CardTitle>
                          <CardDescription className="text-sm mt-2 font-medium">
                            Dr. {apt.doctor?.name || 'Assigned'}
                          </CardDescription>
                        </CardHeader>
                        {apt.prescriptions && (
                          <CardContent className="p-4 pt-0">
                            <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                              <span className="font-bold">Prescription:</span> {apt.prescriptions}
                            </div>
                          </CardContent>
                        )}
                        <CardFooter className="p-4 pt-0 bg-slate-50/50 border-t border-slate-100 dark:bg-slate-800/20 dark:border-slate-800">
                          <Button size="sm" variant="ghost" onClick={() => router.push(`/chat?userId=${apt.doctorId}`)} className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400">
                            <MessageSquare className="w-4 h-4 mr-2" /> Chat with Doctor
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}

          {/* DOCTOR SPECIFIC UI */}
          {['DOCTOR', 'VET'].includes(user.role) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="text-indigo-500" /> My Appointments
                </h3>
                {(!myProfile?.doctorProfile?.isProfileComplete) && (
                  <Button onClick={() => router.push('/doctor-profile-setup')} className="bg-gradient-premium hover:opacity-90 text-white rounded-xl shadow-lg shadow-indigo-500/25 animate-pulse">
                    Complete Your Profile Setup
                  </Button>
                )}
              </div>
              
              {aptLoading ? (
                 <div className="text-center text-slate-500 py-12">Loading appointments...</div>
              ) : appointments?.length === 0 ? (
                 <Card className="border-dashed border-2 shadow-none p-12 text-center text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
                   <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No appointments booked yet.</p>
                   <p className="text-sm">When clients book with you, they will appear here.</p>
                 </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appointments?.map((apt: any) => (
                    <Card key={apt.id} className="glass-card border-t-4 border-t-indigo-500 shadow-md hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                      <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-base flex justify-between items-start mb-2">
                          <div>
                            <div className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                              {apt.user?.name || 'Unknown Client'}
                            </div>
                            <div className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-1">
                              <PawPrint className="w-3 h-3" /> {apt.pet?.name || 'Unknown Pet'} {apt.pet?.breed ? `(${apt.pet.breed})` : ''}
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ml-2 ${
                            apt.status === 'PENDING' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                            apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            apt.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                            apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {apt.status}
                          </span>
                        </CardTitle>
                        <CardDescription className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-indigo-500"/> 
                          {new Date(apt.date).toLocaleDateString()} at {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-5 pt-2 text-sm flex-1 space-y-3">
                        {apt.notes && (
                          <div className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <span className="font-bold block text-xs text-slate-500 uppercase tracking-wider mb-1">Reason for visit:</span>
                            {apt.notes}
                          </div>
                        )}
                        {apt.prescriptions && (
                          <div className="text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                            <span className="font-bold block text-xs text-indigo-400 uppercase tracking-wider mb-1">Prescription/Doctor Notes:</span>
                            {apt.prescriptions}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-5 pt-0 flex gap-2 flex-wrap bg-slate-50/20 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-800 mt-auto items-center justify-center">
                        <div className="w-full flex gap-2 pt-4">
                          {apt.status === 'PENDING' && (
                            <>
                              <Button size="sm" onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')} className="bg-blue-600 hover:bg-blue-700 text-white flex-1 text-xs h-9 shadow-sm"><Check className="w-4 h-4 mr-1.5"/> Confirm</Button>
                              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(apt.id, 'REJECTED')} className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 text-xs h-9 border-red-200"><X className="w-4 h-4 mr-1.5"/> Reject</Button>
                            </>
                          )}
                          {apt.status === 'CONFIRMED' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(apt.id, 'IN_PROGRESS')} className="bg-purple-600 hover:bg-purple-700 text-white flex-1 text-xs h-9 shadow-sm"><Activity className="w-4 h-4 mr-1.5"/> Start Visit</Button>
                          )}
                          {apt.status === 'IN_PROGRESS' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')} className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 text-xs h-9 shadow-sm"><Check className="w-4 h-4 mr-1.5"/> Mark Completed</Button>
                          )}
                        </div>
                        <div className="w-full flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setEditingAppointment(apt);
                            setEditNotes(apt.notes || '');
                            setEditPrescriptions(apt.prescriptions || '');
                          }} className="flex-1 text-xs h-9 mt-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30">
                            <FileText className="w-4 h-4 mr-1.5"/> Notes
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => router.push(`/chat?userId=${apt.userId}`)} className="flex-1 text-xs h-9 mt-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30">
                            <MessageSquare className="w-4 h-4 mr-1.5"/> Chat
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
        </div>
      </main>

      {/* Add Pet Modal */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <PawPrint className="text-indigo-500 w-6 h-6" /> Add a New Pet
            </h2>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600 relative">
                  {newPetImage ? (
                    <img src={newPetImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <PawPrint className="w-8 h-8 text-slate-400" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Click to upload photo</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pet Name *</label>
                <input 
                  type="text" 
                  value={newPetName} 
                  onChange={e => setNewPetName(e.target.value)} 
                  placeholder="e.g. Max"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Breed (Optional)</label>
                <input 
                  type="text" 
                  value={newPetBreed} 
                  onChange={e => setNewPetBreed(e.target.value)} 
                  placeholder="e.g. Golden Retriever"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Age in Years (Optional)</label>
                <input 
                  type="number" 
                  value={newPetAge} 
                  onChange={e => setNewPetAge(e.target.value)} 
                  placeholder="e.g. 3"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" className="flex-1" onClick={() => setIsAddPetModalOpen(false)}>Cancel</Button>
              <Button className="flex-1 bg-gradient-premium hover:opacity-90 text-white rounded-xl" disabled={isSubmittingPet || !newPetName} onClick={handleAddPet}>
                {isSubmittingPet ? 'Saving...' : 'Add Pet'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Appointment Details Modal */}
      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="text-indigo-500 w-6 h-6" /> Update Details
            </h2>
            <p className="text-sm text-slate-500">
              Editing appointment for <strong className="text-slate-800 dark:text-slate-200">{editingAppointment.pet?.name}</strong> with client <strong className="text-slate-800 dark:text-slate-200">{editingAppointment.user?.name}</strong>.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Reason for Visit / Symptoms</label>
                <textarea 
                  value={editNotes} 
                  onChange={e => setEditNotes(e.target.value)} 
                  placeholder="Enter notes about the patient..."
                  className="w-full h-24 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-2">Prescription / Doctor's Advice</label>
                <textarea 
                  value={editPrescriptions} 
                  onChange={e => setEditPrescriptions(e.target.value)} 
                  placeholder="Prescribe medications, diets, or general advice..."
                  className="w-full h-32 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" className="flex-1" onClick={() => setEditingAppointment(null)}>Cancel</Button>
              <Button className="flex-1 bg-gradient-premium hover:opacity-90 text-white rounded-xl" disabled={isSavingDetails} onClick={handleSaveDetails}>
                {isSavingDetails ? 'Saving...' : 'Save Details'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      </div>
    </div>
  );
}
