'use client';
import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calendar, User, Package, Check, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  product?: {
    sellerId: string;
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  user?: {
    name: string;
  };
  items: OrderItem[];
}

export default function SellerOrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/seller-orders');
      return res.data;
    },
    enabled: user?.role === 'SELLER',
  });

  useEffect(() => {
    if (user && user.role !== 'SELLER') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user?.role !== 'SELLER') {
    return null;
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      refetch();
    } catch {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-600" />
          Received Orders
        </h1>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading orders...</div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No orders yet</h3>
            <p className="text-slate-500 mt-2">Orders for your products will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order: Order) => {
              // Filter to show only items that belong to this seller
              const sellerItems = order.items.filter((item: OrderItem) => item.product?.sellerId === (user?.id || user?.sub));
              if (sellerItems.length === 0) return null;
              
              const sellerTotal = sellerItems.reduce((acc: number, item: OrderItem) => acc + (item.price * item.quantity), 0);
              const orderId = order.id || (order as any)._id?.toString() || Math.random().toString();

              return (
                <Card key={orderId} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="bg-slate-100 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Order Date</p>
                        <p className="font-medium flex items-center gap-1 mt-0.5"><Calendar className="w-3.5 h-3.5"/> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Customer</p>
                        <p className="font-medium flex items-center gap-1 mt-0.5"><User className="w-3.5 h-3.5"/> {order.user?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Your Earnings</p>
                        <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">${sellerTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                        order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {order.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {sellerItems.map((item: OrderItem, idx: number) => {
                        const itemId = item.id || (item as any)._id?.toString() || `item-${idx}`;
                        return (
                        <div key={itemId} className="p-4 sm:p-6 flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product?.imageUrl ? (
                              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Img</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.product?.name || 'Unknown Product'}</h4>
                            <div className="mt-1 flex items-center gap-4 text-sm text-slate-600">
                              <span>Qty: {item.quantity}</span>
                              <span>Price: ${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )})}
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                      {order.status === 'PENDING' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'SHIPPED')} className="bg-blue-600 hover:bg-blue-700">
                          <Package className="w-4 h-4 mr-1.5" /> Mark Shipped
                        </Button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'DELIVERED')} className="bg-green-600 hover:bg-green-700">
                          <Check className="w-4 h-4 mr-1.5" /> Mark Delivered
                        </Button>
                      )}
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
