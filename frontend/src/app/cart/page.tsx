'use client';

import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-slate-500">Looks like you haven't added anything to your cart yet.</p>
        <Button onClick={() => router.push('/shop')} className="bg-indigo-600">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId} className="p-4 flex gap-4 items-center border-slate-200">
              <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900 truncate">{item.name}</h3>
                <p className="text-indigo-600 font-bold">${item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 hover:bg-slate-50 text-slate-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 hover:bg-slate-50 text-slate-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-right font-bold text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 border-slate-200 shadow-lg sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-indigo-600">${getTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
              onClick={() => router.push('/checkout')}
            >
              Checkout <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-[10px] text-slate-400 mt-4 text-center">
              Secure checkout powered by Stripe
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
