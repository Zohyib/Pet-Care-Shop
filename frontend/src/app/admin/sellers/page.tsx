'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ShieldCheck, ShoppingBag, Mail, Calendar, Package } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminSellersPage() {
  const [search, setSearch] = useState('');
  
  const { data: sellers, isLoading, refetch } = useQuery({
    queryKey: ['admin-sellers'],
    queryFn: async () => {
      const res = await api.get('/admin/users?role=SELLER');
      return res.data;
    }
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      toast.success(`Seller status updated to ${status}`);
      refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredSellers = sellers?.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative w-full max-w-md">
          <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sellers by name or email..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 col-span-full">Loading sellers...</div>
        ) : filteredSellers?.length === 0 ? (
          <div className="text-center py-12 text-slate-500 col-span-full">No sellers found.</div>
        ) : (
          filteredSellers?.map((seller: any) => (
            <Card key={seller.id} className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 font-bold text-xl flex-shrink-0">
                    {seller.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{seller.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail className="w-3 h-3" /> {seller.email}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{seller._count?.products || 0}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Products</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{seller._count?.orders || 0}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Sales</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Joined
                    </div>
                    <span>{new Date(seller.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5" /> Status
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      seller.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {seller.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                {seller.status === 'ACTIVE' ? (
                  <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleUpdateStatus(seller.id, 'BLOCKED')}>
                    <ShieldAlert className="w-4 h-4 mr-1" /> Block
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="flex-1 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleUpdateStatus(seller.id, 'ACTIVE')}>
                    <ShieldCheck className="w-4 h-4 mr-1" /> Unblock
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
