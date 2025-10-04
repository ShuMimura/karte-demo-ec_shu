'use client';

import { useEffect, useRef, Suspense } from 'react';
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
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 初回レンダリング時はスキップ（計測タグが自動でviewイベントを送信するため）
      if (isFirstRender.current) {
        isFirstRender.current = false;
        console.log('[KARTE] Initial render - view event handled by tracking tag');
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

