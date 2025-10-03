import { Product, CartItem } from '../types';

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export class AnalyticsService {
  private pushToDataLayer(event: string, parameters: Record<string, any>) {
    if (typeof window === 'undefined') return;
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...parameters,
      timestamp: new Date().toISOString()
    });

    // Debug log
    console.log('[Analytics]', event, parameters);
  }

  // view は KARTEの計測タグで自動取得されるため、page_view は送信しない
  trackPageView(pageName: string, additionalParams?: Record<string, any>) {
    // KARTE の view イベントが自動取得するため、dataLayer には送信しない
    console.log('[Analytics] Page View (handled by KARTE tracker):', pageName);
  }

  trackProductView(product: Product) {
    this.pushToDataLayer('view_item', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock
    });
  }

  trackAddToCart(product: Product, quantity: number) {
    this.pushToDataLayer('cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: quantity,
      value: product.price * quantity,
      action: 'add'
    });
  }

  trackRemoveFromCart(product: Product, quantity: number) {
    this.pushToDataLayer('cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: quantity,
      action: 'remove'
    });
  }

  trackPurchase(items: CartItem[], total: number, orderId: string) {
    this.pushToDataLayer('buy', {
      transaction_id: orderId,
      value: total,
      items: items.map(item => ({
        item_id: item.productId,
        quantity: item.quantity
      })),
      item_count: items.length
    });
  }

  trackSearch(query: string, resultCount: number) {
    this.pushToDataLayer('search', {
      search_term: query,
      result_count: resultCount
    });
  }

  trackLogin(userId: string) {
    this.pushToDataLayer('login', {
      user_id: userId,
      method: 'email'
    });
  }

  trackRegister(userId: string) {
    this.pushToDataLayer('signup', {
      user_id: userId,
      method: 'email'
    });
  }

  trackViewCart(itemCount: number, total: number) {
    // view_cart は使用しない（KARTE の標準イベントに合わせる）
    console.log('[Analytics] View Cart (not sent as custom event)');
  }

  trackBeginCheckout(items: CartItem[], total: number) {
    // begin_checkout は使用しない（KARTE の標準イベントに合わせる）
    console.log('[Analytics] Begin Checkout (not sent as custom event)');
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();


