'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      const timer = setTimeout(() => router.push('/shop'), 2000);
      return () => clearTimeout(timer);
    }
  }, [items, isSuccess, router]);

  const handlePayment = async () => {
    if (items.length === 0) return;
    setIsLoading(true);

    try {
      // 1. Create Order & get Payment Intent
      const { data: orderData } = await api.post('/orders', {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      // 2. Mock payment confirmation (normally handled by Stripe Elements)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Mark as Paid (Simulated)
      await api.put(`/orders/${orderData.orderId}/status`, { status: 'PAID' });

      setIsSuccess(true);
      clearCart();
      toast.success('Payment successful! Your order has been placed.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-6 mt-12">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-slate-500">Thank you for your purchase. We've sent a confirmation email to you.</p>
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => router.push('/dashboard')}>View Orders</Button>
          <Button className="flex-1 bg-indigo-600" onClick={() => router.push('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p>Your cart is empty. Redirecting to shop...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Payment Method
            </h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Card Information</span>
                <Lock className="w-3 h-3 text-slate-400" />
              </div>
              <div className="h-10 bg-white border border-slate-200 rounded px-3 flex items-center text-slate-400 text-sm">
                4242 4242 4242 4242
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-white border border-slate-200 rounded px-3 flex items-center text-slate-400 text-sm">MM / YY</div>
                <div className="h-10 bg-white border border-slate-200 rounded px-3 flex items-center text-slate-400 text-sm">CVC</div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Your payment is encrypted and secure.
            </p>
          </Card>

          <Button 
            className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700"
            disabled={isLoading}
            onClick={handlePayment}
          >
            {isLoading ? 'Processing...' : `Pay $${getTotal().toFixed(2)}`}
          </Button>
        </div>

        <div>
          <Card className="p-6 border-slate-100 bg-slate-50/50">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-[300px] overflow-auto mb-6">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.quantity}x {item.name}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-indigo-600">${getTotal().toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
