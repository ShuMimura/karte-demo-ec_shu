'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { analyticsService } from '@/lib/services/analyticsService';
import Button from '@/app/components/Button';

export default function CheckoutCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    analyticsService.trackPageView('checkout_complete', {
      order_id: orderId || undefined
    });
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-4">エラー</h1>
          <p className="text-gray-600 mb-6">
            注文情報が見つかりません
          </p>
          <Button onClick={() => router.push('/')}>
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
            <svg 
              className="w-12 h-12 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">購入が完了しました！</h1>
        
        <p className="text-gray-600 mb-2">
          ご注文ありがとうございます
        </p>
        
        <div className="inline-block bg-gray-100 px-6 py-3 rounded-lg mb-8">
          <p className="text-sm text-gray-600">注文番号</p>
          <p className="font-mono text-lg font-semibold">{orderId}</p>
        </div>

        {/* Order Details Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
          <h2 className="font-semibold text-lg mb-3">📧 次のステップ</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ 注文確認メールを送信しました（デモ）</li>
            <li>✓ 商品の発送準備を開始します（デモ）</li>
            <li>✓ 発送完了後、追跡番号をお知らせします（デモ）</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <p className="text-yellow-800 text-sm">
            ⚠️ これはデモサイトです。実際の商品発送や決済は行われません。
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button
            onClick={() => router.push('/')}
            variant="secondary"
            fullWidth
          >
            ホームに戻る
          </Button>
          <Button
            onClick={() => router.push('/products')}
            fullWidth
          >
            買い物を続ける
          </Button>
        </div>
      </div>
    </div>
  );
}


