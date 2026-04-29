'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Trash2, Search, ExternalLink, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await api.get('/admin/products');
      return res.data;
    }
  });

  const handleDelete = async (id: string) => {
    if(!confirm('Are you sure you want to remove this listing? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product removed from marketplace');
      refetch();
    } catch {
      toast.error('Failed to remove product');
    }
  };

  const filteredProducts = products?.filter((p: any) => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.seller?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products by name, category or seller..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Seller</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading marketplace products...</td></tr>
              ) : filteredProducts?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No products found.</td></tr>
              ) : (
                filteredProducts?.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${product.stock < 5 ? 'text-red-500 font-bold' : 'text-slate-600'}`}>
                        {product.stock} units
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <User className="w-3.5 h-3.5" />
                        {product.seller?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-indigo-600">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-600" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
