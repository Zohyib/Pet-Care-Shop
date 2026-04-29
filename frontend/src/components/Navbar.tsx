'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PawPrint, LogOut, ShoppingBag, ShoppingCart, LayoutDashboard, Package, PlusCircle, FileText, Users, Bot, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getNavItems = () => {
    switch (user.role) {
      case 'USER':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Shop', href: '/shop', icon: ShoppingBag },
          { label: 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
          { label: 'Orders', href: '/orders', icon: FileText },
          { label: 'Become a Seller', href: '/dashboard/become-seller', icon: PlusCircle },
        ];
      case 'SELLER':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { label: 'My Products', href: '/dashboard/seller/products', icon: Package },
          { label: 'Orders', href: '/dashboard/seller/orders', icon: FileText },
        ];
      case 'DOCTOR':
      case 'VET':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ];
      case 'ADMIN':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Manage Users', href: '/admin/users', icon: Users },
          { label: 'Manage Products', href: '/admin/products', icon: Package },
        ];
      default:
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="glass sticky top-0 z-40 border-b-0 shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push('/dashboard')}>
            <div className="bg-gradient-premium p-2 rounded-xl text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <PawPrint className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              PetCare<span className="text-indigo-600 dark:text-indigo-400">Shop</span>
            </span>
          </div>

          <div className="flex-1 flex justify-center px-4">
            <nav className="hidden md:flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200 dark:border-slate-700/50">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isActive ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-1 bg-indigo-500 shadow-sm shadow-indigo-500/50 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/chat')} className="text-slate-500 hover:text-indigo-600">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.push('/ai-vet')} className="text-slate-500 hover:text-pink-600">
              <Bot className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <Link href="/profile" className="cursor-pointer group relative">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500 transition-colors" />
                ) : (
                  <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold text-sm border-2 border-transparent group-hover:border-indigo-500 transition-colors">
                    {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  My Profile
                </div>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/login'); }} className="hidden sm:flex text-slate-500 hover:text-red-600 ml-2">
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-2 hide-scrollbar border-t border-slate-100 dark:border-slate-800">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50'}`}>
                <Icon className="w-3.5 h-3.5" />
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
