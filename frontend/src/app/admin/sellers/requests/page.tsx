'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Store, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSellerRequestsPage() {
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['admin-seller-requests'],
    queryFn: async () => {
      const res = await api.get('/sellers/admin/requests');
      return res.data;
    }
  });

  const handleAction = async (id: string, status: string) => {
    try {
      await api.put(`/sellers/admin/requests/${id}/status`, { status });
      toast.success(`Seller request ${status.toLowerCase()}`);
      refetch();
    } catch {
      toast.error('Failed to update request');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Seller Applications</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading applications...</div>
        ) : requests?.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No pending seller applications.</div>
        ) : (
          requests?.map((request: any) => (
            <Card key={request.id} className="glass-card border-none overflow-hidden hover:scale-[1.01] transition-transform duration-300">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-5">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Store className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{request.businessName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          request.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                          request.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> {request.user?.email}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> {request.contactNumber}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> {request.address}
                      </div>
                      <div className="mt-3 inline-block bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
                        {request.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm italic text-slate-600 dark:text-slate-400">
                      "{request.description || 'No description provided.'}"
                    </div>
                    
                    {request.status === 'PENDING' && (
                      <div className="flex gap-2 mt-auto">
                        <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl" onClick={() => handleAction(request.id, 'REJECTED')}>
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                        <Button size="sm" className="flex-1 bg-gradient-premium hover:opacity-90 text-white rounded-xl shadow-lg shadow-indigo-500/25" onClick={() => handleAction(request.id, 'APPROVED')}>
                          <Check className="w-4 h-4 mr-1" /> Approve
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
