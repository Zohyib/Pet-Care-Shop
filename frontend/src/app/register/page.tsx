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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '', role: 'USER' },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', values);
      setAuth(res.data.user, res.data.access_token);
      toast.success('Registration successful! Welcome to Pet Care Shop.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950">
      
      <div className="hidden lg:flex lg:flex-1 bg-purple-600 overflow-hidden relative justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-700 to-indigo-500 opacity-90" />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 text-center text-white px-12"
        >
          <PawPrint className="w-32 h-32 mx-auto mb-8 text-white/90" />
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-purple-100 max-w-md mx-auto leading-relaxed">
            Create an account to track your pet's life, consult top veterinarians, and get tailored AI assistance.
          </p>
        </motion.div>
        
        <div className="absolute top-[-5%] left-[-10%] w-[35rem] h-[35rem] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800/50"
        >
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              It only takes a minute to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Full Name</Label>
              <Input 
                {...register('name')}
                placeholder="John Doe" 
                className="h-11 bg-white/50 dark:bg-slate-800/50 rounded-xl" 
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Email address</Label>
              <Input 
                {...register('email')}
                placeholder="you@example.com" 
                className="h-11 bg-white/50 dark:bg-slate-800/50 rounded-xl" 
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Password</Label>
              <Input 
                type="password" 
                {...register('password')}
                placeholder="••••••••" 
                className="h-11 bg-white/50 dark:bg-slate-800/50 rounded-xl" 
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Account Type</Label>
              <select
                {...register('role')}
                className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white/50 px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-slate-800/50 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-indigo-500"
              >
                <option value="USER">Pet Owner (User)</option>
                <option value="DOCTOR">Veterinarian (Doctor)</option>
              </select>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-lg shadow-purple-600/25 transition-all mt-4"
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
