'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ShieldCheck, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users?role=USER');
      return res.data;
    }
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      toast.success(`User marked as ${status}`);
      refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      refetch();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users?.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
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
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Appointments</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading users...</td></tr>
              ) : filteredUsers?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
              ) : (
                filteredUsers?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                        user.status === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {user._count?.appointmentsAsUser || 0}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {user._count?.orders || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.status === 'ACTIVE' ? (
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleUpdateStatus(user.id, 'BLOCKED')}>
                            <ShieldAlert className="w-4 h-4 mr-1" /> Block
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleUpdateStatus(user.id, 'ACTIVE')}>
                            <ShieldCheck className="w-4 h-4 mr-1" /> Unblock
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-600" onClick={() => handleDelete(user.id)}>
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
