'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ShieldCheck, UserCog, Mail, MapPin, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState('');
  
  const { data: doctors, isLoading, refetch } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: async () => {
      const res = await api.get('/admin/doctors');
      return res.data;
    }
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      toast.success(`Doctor status updated to ${status}`);
      refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredDoctors = doctors?.filter((d: any) => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.email.toLowerCase().includes(search.toLowerCase()) ||
    d.doctorProfile?.mainSpecialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative w-full max-w-md">
          <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search doctors by name, email or specialty..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading doctors...</div>
        ) : filteredDoctors?.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No doctors found.</div>
        ) : (
          filteredDoctors?.map((doctor: any) => (
            <Card key={doctor.id} className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-2xl flex-shrink-0">
                      {doctor.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{doctor.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          doctor.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {doctor.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="w-3.5 h-3.5" /> {doctor.email}
                      </div>
                      {doctor.doctorProfile?.locationCity && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="w-3.5 h-3.5" /> {doctor.doctorProfile.locationCity}, {doctor.doctorProfile.locationCountry}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                        <GraduationCap className="w-3.5 h-3.5" /> {doctor.doctorProfile?.mainSpecialization || 'Specialty Not Set'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Performance</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{doctor.doctorProfile?.totalPatients || 0}</div>
                          <div className="text-[10px] text-slate-400">Total Patients</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-amber-500">{doctor.doctorProfile?.rating?.toFixed(1) || '0.0'}</div>
                          <div className="text-[10px] text-slate-400">Rating</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {doctor.status === 'ACTIVE' ? (
                        <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleUpdateStatus(doctor.id, 'SUSPENDED')}>
                          <ShieldAlert className="w-4 h-4 mr-1" /> Suspend
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleUpdateStatus(doctor.id, 'ACTIVE')}>
                          <ShieldCheck className="w-4 h-4 mr-1" /> Activate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {doctor.doctorProfile?.bio && (
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{doctor.doctorProfile.bio}"</p>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
