'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, UserCog, ShoppingCart, Package, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  if (isLoading) return <div className="text-slate-500">Loading system stats...</div>;

  const statCards = [
    { label: 'Platform Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-900/30' },
    { label: 'Pet Owners', value: stats?.users || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Verified Doctors', value: stats?.doctors || 0, icon: UserCog, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Active Sellers', value: stats?.sellers || 0, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Products Listed', value: stats?.products || 0, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Appointments', value: stats?.appointments || 0, icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
    { label: 'Total Revenue', value: `$${stats?.revenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="glass-card border-none hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Placeholder for future charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="glass-card border-none">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">Revenue Overview</h3>
            <div className="h-64 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 backdrop-blur-sm">
              Chart data will appear here
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-none">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">User Growth</h3>
            <div className="h-64 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 backdrop-blur-sm">
              Chart data will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
