'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/stores/useStore';
import { analyticsService } from '@/lib/services/analyticsService';
import Button from '../components/Button';

export default function FavoritesPage() {
  const router = useRouter();
  const { getFavoriteItems, removeFromFavorites, addToCart } = useStore();
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.trackPageView('favorites');
    loadFavoriteItems();
  }, []);

  const loadFavoriteItems = async () => {
    setLoading(true);
    const items = await getFavoriteItems();
    setFavoriteItems(items);
    setLoading(false);
  };

  const handleRemove = async (productId: string) => {
    await removeFromFavorites(productId);
    await loadFavoriteItems();
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(product, 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaeded] py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center bg-white rounded p-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#232f3e]"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaeded] py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-2xl font-normal mb-6 text-gray-900">お気に入り</h1>

        {favoriteItems.length === 0 ? (
          <div className="bg-white rounded p-12 text-center">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-normal mb-4 text-gray-900">お気に入りは空です</h2>
            <p className="text-gray-600 mb-6">
              気になる商品をお気に入りに追加して、後で見返すことができます
            </p>
            <Button onClick={() => router.push('/products')}>
              商品を見る
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded p-6">
            <div className="space-y-4">
              {favoriteItems.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded hover:border-gray-300 transition"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-shrink-0 w-32 h-32 bg-white flex items-center justify-center border border-gray-200 rounded cursor-pointer"
                  >
                    <div className="text-gray-400 text-6xl">📦</div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-lg font-normal text-gray-900 hover:text-[#c45500] transition mb-2 cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xs text-gray-600">¥</span>
                      <span className="text-2xl font-normal text-[#b12704]">
                        {product.price.toLocaleString()}
                      </span>
                    </div>
                    {product.stock > 0 ? (
                      <p className="text-xs text-green-700">在庫あり</p>
                    ) : (
                      <p className="text-xs text-red-700">在庫切れ</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="whitespace-nowrap"
                    >
                      カートに入れる
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleRemove(product.id)}
                      className="whitespace-nowrap"
                    >
                      削除
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {favoriteItems.length} 件のお気に入り
                </p>
                <Button
                  variant="secondary"
                  onClick={() => router.push('/products')}
                >
                  商品を見る
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

