'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/stores/useStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { user, cart, favorites, checkAuth, logout } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoriteCount = favorites.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-[#131921] text-white sticky top-0 z-50">
      {/* Top Header */}
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="flex items-center h-[60px] gap-4">
          {/* Logo */}
          <Link href="/" className="text-white hover:opacity-80 transition py-2 px-2 border border-transparent hover:border-white rounded">
            <div className="text-xl font-bold">KARTE Demo EC</div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[800px]">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="商品を検索"
                className="flex-1 px-4 py-2 rounded-l text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a085]"
              />
              <button
                type="submit"
                className="bg-[#16a085] hover:bg-[#138d75] px-6 rounded-r transition"
              >
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="px-2 py-2 border border-transparent hover:border-white rounded cursor-pointer">
                <Link href="/mypage" className="text-xs">
                  こんにちは, {user.name}
                  <div className="font-bold text-sm">アカウント</div>
                </Link>
              </div>
            ) : (
              <div className="px-2 py-2 border border-transparent hover:border-white rounded cursor-pointer">
                <Link href="/auth/login" className="text-xs">
                  ログイン
                  <div className="font-bold text-sm">アカウント</div>
                </Link>
              </div>
            )}
            
            <Link 
              href="/favorites" 
              className="flex items-center gap-1 px-2 py-2 border border-transparent hover:border-white rounded relative"
            >
              <div className="relative">
                <svg 
                  className="w-8 h-8" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                  />
                </svg>
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#f08804] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </div>
              <div className="text-sm font-bold">お気に入り</div>
            </Link>
            
            <Link 
              href="/cart" 
              className="flex items-center gap-2 px-2 py-2 border border-transparent hover:border-white rounded relative"
            >
              <div className="relative">
                <svg 
                  className="w-10 h-10" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" 
                  />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 left-4 bg-[#f08804] text-white text-sm font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="text-sm font-bold">カート</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#37475a]">
        <div className="max-w-[1500px] mx-auto px-4">
          <nav className="flex items-center h-[39px] gap-2 text-sm">
            <Link href="/" className="px-3 py-1.5 hover:bg-[#485769] rounded transition">
              ホーム
            </Link>
            <Link href="/products" className="px-3 py-1.5 hover:bg-[#485769] rounded transition">
              すべて
            </Link>
            <Link href="/products?search=electronics" className="px-3 py-1.5 hover:bg-[#485769] rounded transition">
              電子機器
            </Link>
            <Link href="/products?search=accessories" className="px-3 py-1.5 hover:bg-[#485769] rounded transition">
              アクセサリー
            </Link>
            <Link href="/admin" className="px-3 py-1.5 hover:bg-[#485769] rounded transition">
              管理画面
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

