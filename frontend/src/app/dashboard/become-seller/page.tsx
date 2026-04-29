'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Store, CheckCircle2, Clock, AlertCircle, TrendingUp, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BecomeSellerPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactNumber: '',
    address: '',
    category: 'accessories',
    description: ''
  });

  const { data: request, isLoading: isFetching, refetch } = useQuery({
    queryKey: ['my-seller-request'],
    queryFn: async () => {
      const res = await api.get('/sellers/my-request');
      return res.data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/sellers/request', formData);
      toast.success('Your application has been submitted!');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-8">Loading...</div>;

  if (user?.role === 'SELLER') {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold">You are already a Seller!</h1>
        <p className="text-slate-500">Go to your seller dashboard to manage your products.</p>
        <Button onClick={() => window.location.href = '/dashboard/seller/products'}>Go to Dashboard</Button>
      </div>
    );
  }

  if (request) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="p-8 text-center space-y-6">
          {request.status === 'PENDING' ? (
            <>
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold">Application Under Review</h1>
              <p className="text-slate-500">We've received your application to become a seller. Our team is reviewing it and will notify you soon.</p>
              <div className="bg-slate-50 p-4 rounded-xl text-left space-y-2 text-sm">
                <div className="flex justify-between"><strong>Business:</strong> {request.businessName}</div>
                <div className="flex justify-between"><strong>Category:</strong> {request.category}</div>
                <div className="flex justify-between"><strong>Status:</strong> <span className="text-amber-600 font-bold">PENDING</span></div>
              </div>
            </>
          ) : request.status === 'REJECTED' ? (
            <>
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold">Application Rejected</h1>
              <p className="text-slate-500">Unfortunately, your application was not approved at this time. You can contact support for more details.</p>
            </>
          ) : null}
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="w-20 h-20 bg-gradient-premium text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25">
          <Store className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Partner with PetCare Shop</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
          Unlock a dedicated audience of pet lovers. Grow your business, manage orders effortlessly, and join the fastest-growing pet marketplace.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left Side: Benefits */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="glass-card p-6 border-l-4 border-indigo-500">
            <TrendingUp className="w-8 h-8 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Skyrocket Your Sales</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Tap into our massive network of verified pet owners looking for high-quality products just like yours.</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-teal-500">
            <Users className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Seamless Management</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Our advanced seller dashboard gives you complete control over your inventory, pricing, and order fulfillment.</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-purple-500">
            <ShieldCheck className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Trusted Ecosystem</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">We verify all sellers and buyers, ensuring a secure, scam-free environment for your business to thrive.</p>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="glass-card border-none p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">Seller Application Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <Input 
                required 
                placeholder="Pet Shop Co." 
                value={formData.businessName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <Input 
                required 
                placeholder="+1 234 567 890" 
                value={formData.contactNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, contactNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Business Address</label>
            <Input 
              required 
              placeholder="123 Street, City, Country" 
              value={formData.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Category</label>
            <select 
              className="w-full p-2 rounded-md border border-slate-200 bg-white"
              value={formData.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, category: e.target.value})}
            >
              <option value="food">Pet Food</option>
              <option value="toys">Toys</option>
              <option value="accessories">Accessories</option>
              <option value="grooming">Grooming Products</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tell us about your business</label>
            <Textarea 
              placeholder="What kind of products do you sell?" 
              className="min-h-[100px]"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
            />
          </div>

            <Button type="submit" className="w-full bg-gradient-premium hover:opacity-90 h-14 text-lg font-bold rounded-xl shadow-lg shadow-indigo-500/25" disabled={isLoading}>
              {isLoading ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </form>
        </Card>
        </motion.div>
      </div>
    </div>
  );
}
