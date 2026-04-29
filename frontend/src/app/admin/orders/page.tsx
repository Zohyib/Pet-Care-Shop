'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Search, Calendar, User, Package, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      return res.data;
    }
  });

  const filteredOrders = orders?.filter((o: any) => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED': case 'PAID': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'PENDING': return 'bg-amber-100 text-amber-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
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
            placeholder="Search orders by ID or customer name..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading platform orders...</div>
        ) : filteredOrders?.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No orders found.</div>
        ) : (
          filteredOrders?.map((order: any) => {
            const orderId = order.id || order._id?.toString() || Math.random().toString();
            return (
            <Card key={orderId} className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold text-slate-400">ORDER #{orderId.slice(0, 8)}</div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Customer</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{order.user?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Amount</div>
                      <div className="font-bold text-indigo-600 dark:text-indigo-400">${order.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Order Items</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items?.map((item: any, idx: number) => {
                      const itemId = item.id || item._id?.toString() || `item-${idx}`;
                      return (
                      <div key={itemId} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-slate-400 flex-shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.product?.name}</div>
                          <div className="text-[10px] text-slate-500">{item.quantity} x ${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>
              </div>
            </Card>
          )})
        )}
      </div>
    </div>
  );
}
