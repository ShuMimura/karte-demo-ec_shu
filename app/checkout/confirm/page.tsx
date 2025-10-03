'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Product } from '@/lib/types';
import { useStore } from '@/lib/stores/useStore';
import { analyticsService } from '@/lib/services/analyticsService';
import Button from '@/app/components/Button';

export default function CheckoutConfirmPage() {
  const router = useRouter();
  const { cart, getCartItems, getCartTotal, clearCart } = useStore();
  
  const [cartItems, setCartItems] = useState<Array<CartItem & { product: Product }>>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    analyticsService.trackPageView('checkout_confirm');
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }
    
    const items = await getCartItems();
    const totalAmount = await getCartTotal();
    setCartItems(items);
    setTotal(totalAmount);
    setLoading(false);
  };

  const handlePurchase = async () => {
    setProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate order ID
    const orderId = `order_${Date.now()}`;
    
    // Track purchase event - 商品情報を含めて送信
    const allProducts = await productService.getAllProducts();
    analyticsService.trackPurchase(cart, allProducts, total);
    
    // Clear cart
    clearCart();
    
    // Redirect to completion page
    router.push(`/checkout/complete?orderId=${orderId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">購入確認</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-6">注文内容</h2>
        
        <div className="space-y-4 mb-6">
          {cartItems.map(item => (
            <div key={item.productId} className="flex justify-between items-center py-3 border-b">
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-gray-600">
                  数量: {item.quantity} × ¥{item.product.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ¥{(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-gray-600">
            <span>商品点数</span>
            <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}点</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>小計</span>
            <span>¥{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>送料</span>
            <span>無料</span>
          </div>
          <div className="flex justify-between text-2xl font-bold pt-4 border-t">
            <span>合計</span>
            <span className="text-blue-600">¥{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 text-sm">
          ⚠️ これはデモサイトです。実際の決済は行われません。
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={() => router.push('/cart')}
          variant="secondary"
          fullWidth
          disabled={processing}
        >
          カートに戻る
        </Button>
        <Button
          onClick={handlePurchase}
          fullWidth
          disabled={processing}
        >
          {processing ? '処理中...' : '購入を確定する'}
        </Button>
      </div>
    </div>
  );
}


