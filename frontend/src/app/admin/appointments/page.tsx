'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Clock, User, UserCog, Dog, XCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminAppointmentsPage() {
  const [search, setSearch] = useState('');
  
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: async () => {
      const res = await api.get('/admin/appointments');
      return res.data;
    }
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/appointments/${id}/status`, { status });
      toast.success(`Appointment marked as ${status}`);
      refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredAppointments = appointments?.filter((a: any) => 
    a.user?.name.toLowerCase().includes(search.toLowerCase()) || 
    a.doctor?.name.toLowerCase().includes(search.toLowerCase()) ||
    a.pet?.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'PENDING': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search appointments by user, doctor or pet..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading system appointments...</div>
        ) : filteredAppointments?.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No appointments found.</div>
        ) : (
          filteredAppointments?.map((app: any) => (
            <Card key={app.id} className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors">
              <div className="p-5">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Client</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{app.user?.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600">
                        <UserCog className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Doctor</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{app.doctor?.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600">
                        <Dog className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pet Name</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{app.pet?.name}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-center lg:items-end gap-4 min-w-[180px]">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      {new Date(app.date).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    {app.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}>
                          <XCircle className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50" onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Complete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
