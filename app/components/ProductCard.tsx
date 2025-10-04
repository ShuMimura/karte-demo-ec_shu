'use client';

import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/stores/useStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // ボタンのクリックでない場合のみ詳細ページに遷移
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return; // 処理中なら何もしない
    
    setIsAddingToCart(true);
    setShowAddedMessage(true);
    
    await addToCart(product, 1);
    
    // 2秒後にボタンを元に戻す
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 2000);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col p-4"
    >
      <div className="aspect-square bg-white flex items-center justify-center mb-3">
        <div className="text-gray-400 text-8xl">📦</div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm mb-2 line-clamp-2 text-gray-900 hover:text-[#c45500] transition">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xs text-gray-600">¥</span>
          <span className="text-2xl font-normal text-gray-900">
            {product.price.toLocaleString()}
          </span>
        </div>
        
        {product.stock > 0 ? (
          <p className="text-xs text-green-700 mb-2">在庫あり</p>
        ) : (
          <p className="text-xs text-red-700 mb-2">在庫切れ</p>
        )}
        
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>
        
        {product.stock > 0 && (
          <div className="mt-auto">
            {/* カート追加メッセージ（常にスペースを確保） */}
            <div className={`h-5 mb-0.5 flex items-center justify-center gap-1 text-xs font-medium transition-opacity duration-300 ${
              showAddedMessage ? 'opacity-100 text-green-700' : 'opacity-0'
            }`}>
              {showAddedMessage && (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  カートに追加されました
                </>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full text-xs py-1.5 px-3 rounded-full font-medium transition shadow-sm ${
                isAddingToCart
                  ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                  : 'bg-[#16a085] hover:bg-[#138d75] text-white'
              }`}
            >
              カートに入れる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

