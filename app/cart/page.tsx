'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Product } from '@/lib/types';
import { useStore } from '@/lib/stores/useStore';
import { analyticsService } from '@/lib/services/analyticsService';
import { productService } from '@/lib/services/productService';
import Button from '../components/Button';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getCartItems, getCartTotal } = useStore();
  
  const [cartItems, setCartItems] = useState<Array<CartItem & { product: Product }>>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    analyticsService.trackPageView('cart');
    loadCart(true); // 初回ロードフラグをtrueで呼び出し
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      loadCart(false); // 2回目以降はcartイベントを送信しない
    }
  }, [cart, isInitialLoad]);

  const loadCart = async (shouldTrackCart: boolean = false) => {
    setLoading(true);
    const items = await getCartItems();
    const totalAmount = await getCartTotal();
    setCartItems(items);
    setTotal(totalAmount);
    
    // カート閲覧時にcartイベントを送信（初回ロード時のみ）
    if (shouldTrackCart) {
      const allProducts = await productService.getProducts();
      analyticsService.trackViewCart(cart, allProducts);
      setIsInitialLoad(false);
    }
    
    setLoading(false);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      analyticsService.trackBeginCheckout(cart, total);
      router.push('/checkout/confirm');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaeded] py-12">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="text-center bg-white rounded p-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#232f3e]"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#eaeded] py-12">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="text-center bg-white rounded p-12">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-normal mb-4">カートは空です</h1>
            <p className="text-gray-600 mb-6">
              商品を追加してショッピングを始めましょう
            </p>
            <Button onClick={() => router.push('/products')}>
              商品を見る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaeded] py-6">
      <div className="max-w-[1500px] mx-auto px-4">
        <h1 className="text-2xl font-normal mb-6">ショッピングカート</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-3">
            {cartItems.map(item => (
              <div 
                key={item.productId}
                className="bg-white rounded p-4 flex gap-4"
              >
                <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center border border-gray-200 rounded">
                  <div className="text-5xl">📦</div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-normal mb-1">
                    <a 
                      href={`/products/${item.product.id}`}
                      className="hover:text-[#c45500] hover:underline"
                    >
                      {item.product.name}
                    </a>
                  </h3>
                  
                  {item.product.stock > 0 ? (
                    <p className="text-xs text-green-700 mb-2">在庫あり</p>
                  ) : (
                    <p className="text-xs text-red-700 mb-2">在庫切れ</p>
                  )}

                  <div className="flex items-center gap-6 mb-3">
                    <select
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50"
                      disabled={item.product.stock === 0}
                    >
                      {[...Array(Math.min(10, item.product.stock))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>数量: {i + 1}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-[#007185] text-sm hover:text-[#c45500] hover:underline"
                    >
                      削除
                    </button>
                  </div>

                  <div className="text-lg font-normal text-[#b12704]">
                    ¥{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded p-4 border border-gray-300 sticky top-24">
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  小計 ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} 個の商品):
                </p>
                <p className="text-lg font-normal text-[#b12704]">
                  ¥{total.toLocaleString()}
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                fullWidth
                className="mb-2"
              >
                レジに進む
              </Button>

              <Button
                variant="secondary"
                onClick={() => router.push('/products')}
                fullWidth
              >
                買い物を続ける
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


