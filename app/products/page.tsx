'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { productService } from '@/lib/services/productService';
import { analyticsService } from '@/lib/services/analyticsService';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    analyticsService.trackPageView('product_list', { 
      search_query: searchQuery || undefined 
    });
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let result: Product[];
        
        if (searchQuery) {
          result = await productService.searchProducts(searchQuery);
          analyticsService.trackSearch(searchQuery, result.length);
        } else if (category !== 'all') {
          result = await productService.getProductsByCategory(category);
        } else {
          result = await productService.getProducts();
        }
        
        setProducts(result);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, category]);

  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'electronics', label: '電子機器' },
    { value: 'accessories', label: 'アクセサリー' },
  ];

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-normal mb-4">
            {searchQuery ? `"${searchQuery}" の検索結果` : 'すべての商品'}
          </h1>
          
          {!searchQuery && (
            <div className="flex gap-2 mb-4">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded text-sm font-normal transition border ${
                    category === cat.value
                      ? 'bg-[#232f3e] text-white border-[#232f3e]'
                      : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-white rounded">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#232f3e]"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12 bg-white rounded">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-normal mb-2">該当商品がありません</h2>
            <p className="text-gray-600 mb-6 text-sm">
              {searchQuery 
                ? '別のキーワードで検索してみてください'
                : 'まだ商品が登録されていません'
              }
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="bg-white p-6 rounded">
            <p className="text-sm text-gray-700 mb-6">
              <span className="font-semibold">{products.length}</span> 件の結果
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


