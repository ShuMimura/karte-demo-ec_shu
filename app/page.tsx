'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { analyticsService } from '@/lib/services/analyticsService';
import { productService } from '@/lib/services/productService';
import { Product } from '@/lib/types';
import ProductCard from './components/ProductCard';

export default function Home() {
  const router = useRouter();
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRanges, setPriceRanges] = useState({
    low: false,    // 0-5000
    mid: false,    // 5000-10000
    high: false,   // 10000+
  });
  const [inStockOnly, setInStockOnly] = useState(true);

  useEffect(() => {
    analyticsService.trackPageView('home');
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, priceRanges, inStockOnly, allProducts]);

  const loadProducts = async () => {
    const products = await productService.getProducts();
    setNewProducts(products.slice(0, 5));
    setAllProducts(products);
  };

  const filterProducts = () => {
    let products = [...allProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      products = products.filter(p => p.category === selectedCategory);
    }

    // Price range filter
    const anyPriceSelected = priceRanges.low || priceRanges.mid || priceRanges.high;
    if (anyPriceSelected) {
      products = products.filter(p => {
        if (priceRanges.low && p.price < 5000) return true;
        if (priceRanges.mid && p.price >= 5000 && p.price < 10000) return true;
        if (priceRanges.high && p.price >= 10000) return true;
        return false;
      });
    }

    // Stock filter
    if (inStockOnly) {
      products = products.filter(p => p.stock > 0);
    }

    setFilteredProducts(products);
  };

  const handlePriceRangeChange = (range: 'low' | 'mid' | 'high') => {
    setPriceRanges(prev => ({
      ...prev,
      [range]: !prev[range]
    }));
  };

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded p-4 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">カテゴリ</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    selectedCategory === 'all'
                      ? 'bg-[#16a085] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  すべて
                </button>
                <button
                  onClick={() => setSelectedCategory('electronics')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    selectedCategory === 'electronics'
                      ? 'bg-[#16a085] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  電子機器
                </button>
                <button
                  onClick={() => setSelectedCategory('accessories')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    selectedCategory === 'accessories'
                      ? 'bg-[#16a085] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  アクセサリー
                </button>
              </nav>

              <hr className="my-4 border-gray-200" />

              <h3 className="text-lg font-semibold mb-4 text-gray-900">価格帯</h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={priceRanges.low}
                    onChange={() => handlePriceRangeChange('low')}
                  />
                  ¥0 - ¥5,000
                </label>
                <label className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={priceRanges.mid}
                    onChange={() => handlePriceRangeChange('mid')}
                  />
                  ¥5,000 - ¥10,000
                </label>
                <label className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={priceRanges.high}
                    onChange={() => handlePriceRangeChange('high')}
                  />
                  ¥10,000以上
                </label>
              </div>

              <hr className="my-4 border-gray-200" />

              <h3 className="text-lg font-semibold mb-4 text-gray-900">在庫状況</h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  在庫あり
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* New Products Section */}
            <section className="mb-6">
              <div className="bg-white rounded p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">新着商品</h2>
                  <Link 
                    href="/products"
                    className="text-[#16a085] hover:text-[#138d75] text-sm hover:underline"
                  >
                    もっと見る →
                  </Link>
                </div>
                
                <div className="overflow-x-auto -mx-2 px-2">
                  <div className="flex gap-4 pb-2" style={{ minWidth: 'max-content' }}>
                    {newProducts.map(product => (
                      <div key={product.id} className="w-48 flex-shrink-0">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* All Products Section */}
            <section>
              <div className="bg-white rounded p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">すべての商品</h2>
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length}件の商品
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">該当する商品がありません</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setPriceRanges({ low: false, mid: false, high: false });
                        setInStockOnly(false);
                      }}
                      className="mt-4 text-[#16a085] hover:text-[#138d75] text-sm hover:underline"
                    >
                      フィルタをリセット
                    </button>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
