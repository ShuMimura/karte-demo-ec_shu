'use client';

import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/stores/useStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useStore();

  const handleCardClick = (e: React.MouseEvent) => {
    // ボタンのクリックでない場合のみ詳細ページに遷移
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await addToCart(product, 1);
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
          <button 
            onClick={handleAddToCart}
            className="mt-auto bg-[#16a085] hover:bg-[#138d75] text-white text-xs py-1.5 px-3 rounded-full font-medium transition shadow-sm"
          >
            カートに入れる
          </button>
        )}
      </div>
    </div>
  );
}

