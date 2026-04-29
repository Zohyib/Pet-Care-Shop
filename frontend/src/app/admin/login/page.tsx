'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { Shield, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.user.role !== 'ADMIN') {
        toast.error('Access Denied. Admins only.');
        setIsLoading(false);
        return;
      }

      setAuth(data.user, data.access_token);
      toast.success('Admin authenticated successfully');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600/20 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">System Admin Portal</h1>
          <p className="text-slate-400 mt-2 text-sm text-center">Enter your credentials to access the central control system.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="admin@petcare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Master Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Access Control Center'}
          </Button>
        </form>
      </div>
    </div>
  );
}
