'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function GTMPageViewContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      // ページ遷移時にGTMにページビューイベントを送信
      window.dataLayer.push({
        event: 'pageview',
        page: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
      });
      
      console.log('[GTM] Page view:', pathname);
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

