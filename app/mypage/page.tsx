'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/stores/useStore';
import { analyticsService } from '@/lib/services/analyticsService';
import Button from '../components/Button';

export default function MyPage() {
  const router = useRouter();
  const { user, logout, checkAuth } = useStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      checkAuth();
      setIsChecking(false);
    };
    check();
  }, [checkAuth]);

  useEffect(() => {
    // checkAuthが完了するまで待つ
    if (isChecking) return;
    
    if (user) {
      analyticsService.trackPageView('mypage', { user_id: user.id });
    } else {
      // Not logged in, redirect to login
      router.push('/auth/login');
    }
  }, [user, router, isChecking]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
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
      <h1 className="text-4xl font-bold mb-8">マイページ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span>👤</span>
            ユーザー情報
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">お名前</label>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">メールアドレス</label>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">会員ID</label>
              <p className="text-sm text-gray-500 font-mono">{user.id}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">登録日</label>
              <p className="text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span>⚡</span>
            クイックアクション
          </h2>
          
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/products')}
              fullWidth
              variant="secondary"
            >
              商品を探す
            </Button>
            
            <Button
              onClick={() => router.push('/cart')}
              fullWidth
              variant="secondary"
            >
              カートを見る
            </Button>
            
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                fullWidth
                variant="danger"
              >
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          ようこそ、{user.name}さん！
        </h3>
        <p className="text-blue-800">
          KARTE Demo ECサイトをご利用いただきありがとうございます。
          このサイトではKARTEの各種機能を検証することができます。
        </p>
      </div>
    </div>
  );
}


