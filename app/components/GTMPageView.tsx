'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GTMPageView() {
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

