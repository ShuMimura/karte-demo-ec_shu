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

  // view_item: 商品詳細ページ閲覧時
  trackProductView(product: Product) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    this.pushToDataLayer('view_item', {
      item_id: product.id,                    // 必須フィールド
      name: product.name,                     // item_name → name（KARTEの公式フィールド名）
      price: product.price,
      item_url: `${baseUrl}/products/${product.id}`,
      item_image_url: product.imageUrl,
      l_category_name: product.category       // category_name → l_category_name
    });
  }

  // cart: カート追加時（カート状態全体を送信）
  trackAddToCart(product: Product, quantity: number, allCartItems: CartItem[], allProducts: Product[]) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    // カート内の全商品情報
    const items = allCartItems.map(cartItem => {
      const prod = allProducts.find(p => p.id === cartItem.productId);
      return {
        item_id: cartItem.productId,
        name: prod?.name || '',
        price: prod?.price || 0,
        quantity: cartItem.quantity,
        item_url: `${baseUrl}/products/${cartItem.productId}`,
        item_image_url: prod?.imageUrl || '',
        category_name: prod?.category || ''
      };
    });

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    this.pushToDataLayer('cart', {
      price: totalPrice,
      quantity: totalQuantity,
      status: items.length > 0,
      items: items,
      added_item_id: product.id,
      deleted_item_id: null,
      item_ids: items.map(item => item.item_id),
      item_names: items.map(item => item.name),
      item_prices: items.map(item => item.price),
      item_quantities: items.map(item => item.quantity),
      item_urls: items.map(item => item.item_url),
      item_image_urls: items.map(item => item.item_image_url)
    });
  }

  // cart: カート削除時（カート状態全体を送信）
  trackRemoveFromCart(product: Product, allCartItems: CartItem[], allProducts: Product[]) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    // カート内の全商品情報
    const items = allCartItems.map(cartItem => {
      const prod = allProducts.find(p => p.id === cartItem.productId);
      return {
        item_id: cartItem.productId,
        name: prod?.name || '',
        price: prod?.price || 0,
        quantity: cartItem.quantity,
        item_url: `${baseUrl}/products/${cartItem.productId}`,
        item_image_url: prod?.imageUrl || '',
        category_name: prod?.category || ''
      };
    });

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    this.pushToDataLayer('cart', {
      price: totalPrice,
      quantity: totalQuantity,
      status: items.length > 0,
      items: items,
      added_item_id: null,
      deleted_item_id: product.id,
      item_ids: items.map(item => item.item_id),
      item_names: items.map(item => item.name),
      item_prices: items.map(item => item.price),
      item_quantities: items.map(item => item.quantity),
      item_urls: items.map(item => item.item_url),
      item_image_urls: items.map(item => item.item_image_url)
    });
  }

  // buy: 購入完了時
  trackPurchase(items: CartItem[], allProducts: Product[], total: number) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    const purchaseItems = items.map(cartItem => {
      const prod = allProducts.find(p => p.id === cartItem.productId);
      return {
        item_id: cartItem.productId,
        name: prod?.name || '',
        price: prod?.price || 0,
        quantity: cartItem.quantity,
        item_url: `${baseUrl}/products/${cartItem.productId}`,
        item_image_url: prod?.imageUrl || '',
        category_name: prod?.category || ''
      };
    });

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    this.pushToDataLayer('buy', {
      price: total,
      quantity: totalQuantity,
      items: purchaseItems
    });
  }

  // search: 検索ボタン押下時
  trackSearch(query: string) {
    this.pushToDataLayer('search', {
      keyword: query
    });
  }

  // login: ログイン時
  trackLogin(userId: string) {
    this.pushToDataLayer('login', {});
  }

  // signup: 会員登録完了時
  trackRegister(userId: string, userName: string, email: string) {
    this.pushToDataLayer('signup', {
      name: userName,
      email: email,
      signup_date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    });
  }

  trackViewCart(itemCount: number, total: number) {
    // cart イベントで代替
    console.log('[Analytics] View Cart (use cart event instead)');
  }

  trackBeginCheckout(items: CartItem[], total: number) {
    // cart イベントで代替
    console.log('[Analytics] Begin Checkout (use cart event instead)');
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();


