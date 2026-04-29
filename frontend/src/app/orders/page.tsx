'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/my-orders');
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-indigo-600" />
          My Orders
        </h1>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading orders...</div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No orders yet</h3>
            <p className="text-slate-500 mt-2">When you purchase items from the shop, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order: any) => {
              const orderId = order.id || order._id?.toString() || Math.random().toString();
              return (
              <Card key={orderId} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Order Placed</p>
                      <p className="font-medium flex items-center gap-1 mt-0.5"><Calendar className="w-3.5 h-3.5"/> {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Amount</p>
                      <p className="font-medium mt-0.5">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 mr-2">Order #{orderId.slice(0, 8).toUpperCase()}</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                      order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {order.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {order.status === 'DELIVERED' && <CheckCircle2 className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {order.items?.map((item: any, idx: number) => {
                      const itemId = item.id || item._id?.toString() || `item-${idx}`;
                      return (
                      <div key={itemId} className="p-4 sm:p-6 flex items-center gap-4 sm:gap-6">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Img</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.product?.name || 'Unknown Product'}</h4>
                          <p className="text-sm text-slate-500 mt-1">{item.product?.category}</p>
                          <div className="mt-2 flex items-center gap-4">
                            <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                            <span className="text-sm text-slate-500">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
