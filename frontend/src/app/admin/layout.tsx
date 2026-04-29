'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, UserCog, Package, ShoppingCart, Calendar, LogOut, Settings, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not logged in at all, or not an admin, redirect.
    // Except if they are on the login page itself.
    if (!pathname.includes('/admin/login')) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, router, pathname]);

  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  if (!user || user.role !== 'ADMIN') return null;

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Doctors', href: '/admin/doctors', icon: UserCog },
    { label: 'Sellers', href: '/admin/sellers', icon: ShoppingCart },
    { label: 'Seller Requests', href: '/admin/sellers/requests', icon: Store },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <aside className="w-64 glass-card border-r-0 rounded-none rounded-r-3xl flex flex-col fixed inset-y-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-premium">
          <div className="bg-white/20 p-1.5 rounded-lg text-white mr-3 backdrop-blur-sm">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Admin Control</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Management</div>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-premium text-white shadow-md shadow-indigo-500/25' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Administrator</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Subtle background blob */}
        <div className="absolute top-0 right-0 -mt-40 -mr-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <header className="h-16 glass sticky top-0 z-40 border-b-0 shadow-sm flex items-center justify-between px-8 mb-6 mt-4 mx-6 rounded-2xl">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize tracking-tight">
            {pathname === '/admin' ? 'Dashboard Overview' : pathname.split('/').pop()}
          </h1>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            System Control Center
          </div>
        </header>
        <div className="px-8 pb-8 flex-1 overflow-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
