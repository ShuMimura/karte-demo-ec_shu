'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { productService } from '@/lib/services/productService';
import { analyticsService } from '@/lib/services/analyticsService';
import { useStore } from '@/lib/stores/useStore';
import Button from '@/app/components/Button';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const addToCart = useStore(state => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const result = await productService.getProduct(productId);
        if (result) {
          setProduct(result);
          analyticsService.trackProductView(result);
          analyticsService.trackPageView('product_detail', { 
            product_id: result.id,
            product_name: result.name 
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    setAddedToCart(true);
    
    setTimeout(() => setAddedToCart(false), 2000);
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

  if (!product) {
    return (
      <div className="min-h-screen bg-[#eaeded] py-12">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="text-center bg-white rounded p-12">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-normal mb-4">商品が見つかりません</h1>
            <p className="text-gray-600 mb-6">
              お探しの商品は存在しないか、削除された可能性があります
            </p>
            <Button onClick={() => router.push('/products')}>
              商品一覧に戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaeded] py-6">
      <div className="max-w-[1500px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-gray-600">
          <a href="/" className="hover:text-[#c45500] hover:underline">ホーム</a>
          <span className="mx-2">›</span>
          <a href="/products" className="hover:text-[#c45500] hover:underline">すべての商品</a>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded p-8 sticky top-24">
              <div className="aspect-square bg-white flex items-center justify-center border border-gray-200 rounded">
                <div className="text-gray-400" style={{ fontSize: '10rem' }}>📦</div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded p-6 mb-4">
              <h1 className="text-2xl font-normal mb-4 text-gray-900">{product.name}</h1>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xs text-gray-600">価格:</span>
                  <span className="text-xs text-gray-600">¥</span>
                  <span className="text-3xl font-normal text-[#b12704]">
                    {product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {product.description}
              </p>

              <div className="space-y-2 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">カテゴリー:</span>
                  <span className="font-medium text-gray-900">
                    {product.category === 'electronics' ? '電子機器' : 'アクセサリー'}
                  </span>
                </div>
                {product.stock > 0 ? (
                  <div className="text-green-700 font-medium">在庫あり</div>
                ) : (
                  <div className="text-red-700 font-medium">在庫切れ</div>
                )}
              </div>
            </div>

            {/* Add to Cart Box */}
            <div className="bg-white rounded p-6 border border-gray-300">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-xs text-gray-600">¥</span>
                <span className="text-3xl font-normal text-[#b12704]">
                  {product.price.toLocaleString()}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="mb-4 text-sm">
                  <span className="text-green-700 font-medium">在庫あり</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <label className="text-sm text-gray-900 font-medium">数量:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white hover:bg-gray-50 cursor-pointer"
                  disabled={product.stock === 0}
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                fullWidth
                className="mb-3"
              >
                {addedToCart ? '✓ カートに追加しました' : 'カートに入れる'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => router.push('/products')}
                fullWidth
              >
                商品一覧に戻る
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
