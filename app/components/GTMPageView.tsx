'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// 型定義
declare global {
  interface Window {
    krt: (command: string, eventName: string, params?: any) => void;
  }
}

function GTMPageViewContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 初回ロードかどうかを判定
      // 初回ロード時は計測タグが自動でviewイベントを送信するので、ここでは送信しない
      const isInitialLoad = !window.history.state || window.history.state.idx === 0;
      
      if (!isInitialLoad) {
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
      } else {
        console.log('[KARTE] Initial load - view event handled by tracking tag');
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GTMPageView() {
  return (
    <Suspense fallback={null}>
      <GTMPageViewContent />
    </Suspense>
  );
}

