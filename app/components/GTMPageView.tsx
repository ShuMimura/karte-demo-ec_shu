'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/stores/useStore';
import { analyticsService } from '@/lib/services/analyticsService';

// 型定義
declare global {
  interface Window {
    krt: (command: string, eventName: string, params?: any) => void;
    __karte_initial_view_sent?: boolean;
  }
}

function GTMPageViewContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useStore(state => state.user);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // グローバル変数で初回ロードかどうかを判定
      if (!window.__karte_initial_view_sent) {
        // 初回ロード時（計測タグが自動でviewを送信するため、ここでは送信しない）
        window.__karte_initial_view_sent = true;
        console.log('[KARTE] Initial page load - view event handled by tracking tag');
        
        // ログイン状態の場合、identifyイベントを送信
        if (user) {
          analyticsService.trackIdentify(user.id, user.name, user.email);
        }
        return;
      }
      
      // 2回目以降のページ遷移時のみ実行
      // GTMにページビューイベントを送信
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'pageview',
          page: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
        });
        console.log('[GTM] Page view:', pathname);
      }
      
      // KARTEにviewイベントを送信（SPA対応）
      if (typeof window.krt !== 'undefined') {
        window.krt('send', 'view');
        console.log('[KARTE] View event sent:', pathname);
      }
      
      // ログイン状態の場合、identifyイベントを送信
      if (user) {
        analyticsService.trackIdentify(user.id, user.name, user.email);
      }
    }
  }, [pathname, searchParams, user]);

  return null;
}

export default function GTMPageView() {
  return (
    <Suspense fallback={null}>
      <GTMPageViewContent />
    </Suspense>
  );
}

