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

  trackPageView(pageName: string, additionalParams?: Record<string, any>) {
    this.pushToDataLayer('page_view', {
      page_name: pageName,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      ...additionalParams
    });
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
    this.pushToDataLayer('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: quantity,
      value: product.price * quantity
    });
  }

  trackRemoveFromCart(product: Product, quantity: number) {
    this.pushToDataLayer('remove_from_cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: quantity
    });
  }

  trackPurchase(items: CartItem[], total: number, orderId: string) {
    this.pushToDataLayer('purchase', {
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
    this.pushToDataLayer('sign_up', {
      user_id: userId,
      method: 'email'
    });
  }

  trackViewCart(itemCount: number, total: number) {
    this.pushToDataLayer('view_cart', {
      item_count: itemCount,
      value: total
    });
  }

  trackBeginCheckout(items: CartItem[], total: number) {
    this.pushToDataLayer('begin_checkout', {
      value: total,
      item_count: items.length
    });
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();


