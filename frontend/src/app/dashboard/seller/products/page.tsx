'use client';
import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export default function SellerProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Food',
    stock: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const res = await api.get(`/products?sellerId=${user?.id || user?.sub}`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/products', formData);
      toast.success('Product added successfully!');
      setIsAddModalOpen(false);
      setFormData({ name: '', description: '', price: '', category: 'Food', stock: '', imageUrl: '' });
      refetch();
    } catch {
      toast.error('Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      refetch();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" />
            My Products
          </h1>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading products...</div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No products listed</h3>
            <p className="text-slate-500 mt-2 mb-6">Start selling by adding your first product to the shop.</p>
            <Button onClick={() => setIsAddModalOpen(true)}>Add Your First Product</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <span className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded text-xs font-bold shadow-sm">
                    {product.category}
                  </span>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg line-clamp-1 flex-1">{product.name}</h3>
                  </div>
                  <p className="font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-slate-500 mb-4 flex-1">Stock: {product.stock}</p>
                  
                  <div className="flex gap-2 mt-auto">
                    {/* Simplified: only delete works for now, edit could be added later */}
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto pt-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-10 px-3 rounded-lg border dark:border-slate-700 bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-lg border dark:border-slate-700 bg-transparent resize-none h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full h-10 px-3 rounded-lg border dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Qty</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full h-10 px-3 rounded-lg border dark:border-slate-700 bg-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-10 px-3 rounded-lg border dark:border-slate-700 bg-transparent">
                    <option value="Food">Food</option>
                    <option value="Toys">Toys</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Medicine">Medicine</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                <input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full h-10 px-3 rounded-lg border dark:border-slate-700 bg-transparent" placeholder="https://..." />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-indigo-600 text-white" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Add Product'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
