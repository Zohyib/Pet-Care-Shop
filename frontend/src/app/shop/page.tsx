'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ShopPage() {
  const { addItem } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    },
  });

  const categories = ['All', 'Food', 'Toys', 'Accessories', 'Grooming', 'Medicine'];

  const filteredProducts = products?.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Pet Shop</h1>
            <p className="text-slate-500 mt-1">Premium products for your furry friends</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md w-full md:w-64 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {categories.map(c => (
                <Button 
                  key={c} 
                  variant={categoryFilter === c || (c === 'All' && !categoryFilter) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(c === 'All' ? '' : c)}
                  className={`rounded-full whitespace-nowrap transition-all ${categoryFilter === c || (c === 'All' && !categoryFilter) ? 'bg-gradient-premium shadow-lg text-white border-transparent' : 'glass-card hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-t-xl" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl">
            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No products found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <motion.div 
            initial="hidden" animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredProducts?.map((product: any) => (
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }}} key={product.id}>
                <Card className="group overflow-hidden glass-card hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border-none">
                <div className="relative h-56 bg-slate-100/50 dark:bg-slate-800/50 overflow-hidden rounded-t-[1.3rem]">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400">
                      No Image
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-red-600 text-white font-bold px-4 py-1.5 rounded-full text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 flex-1" title={product.name}>
                      {product.name}
                    </h3>
                    <span className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">4.8</span>
                    <span className="text-xs text-slate-400 ml-1">(120)</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  <Button 
                    className="w-full mt-auto rounded-xl shadow-lg bg-gradient-premium hover:opacity-90 transition-all font-bold text-white" 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
