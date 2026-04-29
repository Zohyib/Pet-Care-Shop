'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PawPrint, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      setAuth(res.data.user, res.data.access_token);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800/50"
        >
          <div className="flex flex-col items-center">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-premium p-3 rounded-2xl shadow-lg shadow-indigo-600/30 mb-4"
            >
              <PawPrint className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to manage your pets and appointments
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Email address</Label>
              <Input 
                {...register('email')}
                placeholder="you@example.com"
                className="h-12 bg-white/50 dark:bg-slate-800/50 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500" 
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Password</Label>
              <Input 
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="h-12 bg-white/50 dark:bg-slate-800/50 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500" 
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-premium hover:opacity-90 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
      
      {/* Decorative right side for larger screens */}
      <div className="hidden lg:flex lg:flex-1 bg-slate-900 overflow-hidden relative justify-center items-center">
        <div className="absolute inset-0 bg-gradient-premium opacity-90" />
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 text-center text-white px-12"
        >
          <PawPrint className="w-32 h-32 mx-auto mb-8 text-white/90" />
          <h2 className="text-4xl font-bold mb-4">Pet Care Shop</h2>
          <p className="text-xl text-indigo-100 max-w-md mx-auto leading-relaxed">
            The ultimate ecosystem for pet owners and veterinarians. Manage health, appointments, and get AI advice—all in one place.
          </p>
        </motion.div>
        
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      </div>
    </div>
  );
}
