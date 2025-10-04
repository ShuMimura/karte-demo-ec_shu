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
        l_category_name: prod?.category || ''
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
        l_category_name: prod?.category || ''
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
        l_category_name: prod?.category || ''
      };
    });

    this.pushToDataLayer('buy', {
      revenue: total,
      items: purchaseItems
    });
  }

  // search: 検索ボタン押下時
  trackSearch(query: string) {
    this.pushToDataLayer('search', {
      keyword: query
    });
  }

  // identify: ユーザー情報送信（ログイン時、情報更新時）
  trackIdentify(userId: string, userName: string, email: string) {
    this.pushToDataLayer('identify', {
      user_id: userId,
      name: userName,
      email: email
    });
  }

  // attribute: ユーザー属性情報送信
  trackAttribute(userId: string, birthday?: string, age?: number, gender?: string) {
    const attributes: any = {
      user_id: userId
    };
    
    if (birthday) attributes.birthday = birthday;
    if (age !== undefined) attributes.age = age;
    if (gender) attributes.gender = gender;
    
    this.pushToDataLayer('attribute', attributes);
  }

  // login: ログイン時（カスタムイベント）
  trackLogin(userId: string, userName: string, email: string, birthday?: string, age?: number, gender?: string) {
    // identifyイベントを送信
    this.trackIdentify(userId, userName, email);
    
    // attributeイベントを送信
    this.trackAttribute(userId, birthday, age, gender);
    
    // loginカスタムイベントを送信（ログイン回数カウント用など）
    this.pushToDataLayer('login', {
      user_id: userId
    });
  }

  // signup: 会員登録完了時
  trackRegister(userId: string, userName: string, email: string, birthday?: string, age?: number, gender?: string) {
    // identifyイベントを送信
    this.trackIdentify(userId, userName, email);
    
    // attributeイベントを送信
    this.trackAttribute(userId, birthday, age, gender);
    
    // signupカスタムイベントを送信
    this.pushToDataLayer('signup', {
      user_id: userId,
      name: userName,
      email: email,
      signup_date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    });
  }

  // cart: カートページ閲覧時（カート状態全体を送信）
  trackViewCart(allCartItems: CartItem[], allProducts: Product[]) {
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
        l_category_name: prod?.category || ''
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
      deleted_item_id: null,
      item_ids: items.map(item => item.item_id),
      item_names: items.map(item => item.name),
      item_prices: items.map(item => item.price),
      item_quantities: items.map(item => item.quantity),
      item_urls: items.map(item => item.item_url),
      item_image_urls: items.map(item => item.item_image_url)
    });
  }

  // cart: カート数量変更時（カート状態全体を送信）
  trackUpdateCart(allCartItems: CartItem[], allProducts: Product[]) {
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
        l_category_name: prod?.category || ''
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
      deleted_item_id: null,
      item_ids: items.map(item => item.item_id),
      item_names: items.map(item => item.name),
      item_prices: items.map(item => item.price),
      item_quantities: items.map(item => item.quantity),
      item_urls: items.map(item => item.item_url),
      item_image_urls: items.map(item => item.item_image_url)
    });
  }

  trackBeginCheckout(items: CartItem[], total: number) {
    // cart イベントで代替
    console.log('[Analytics] Begin Checkout (use cart event instead)');
  }

  // favorite: お気に入り追加時（お気に入り全体の状態を送信）
  trackAddToFavorites(addedProduct: Product, allFavoriteProducts: Product[]) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    // お気に入り商品の配列情報
    const items = allFavoriteProducts.map(product => ({
      item_id: product.id,
      name: product.name,
      price: product.price,
      item_url: `${baseUrl}/products/${product.id}`,
      item_image_url: product.imageUrl,
      l_category_name: product.category
    }));

    const totalPrice = allFavoriteProducts.reduce((sum, p) => sum + p.price, 0);
    const totalQuantity = allFavoriteProducts.length;

    this.pushToDataLayer('favorite', {
      price: totalPrice,
      quantity: totalQuantity,
      status: totalQuantity > 0,
      added_item_id: addedProduct.id,
      deleted_item_id: null,
      items: items,
      item_ids: items.map(item => item.item_id),
      item_names: items.map(item => item.name),
      item_prices: items.map(item => item.price),
      item_urls: items.map(item => item.item_url),
      item_image_urls: items.map(item => item.item_image_url),
      l_category_names: items.map(item => item.l_category_name)
    });
  }

  // favorite: お気に入り削除時（お気に入り全体の状態を送信）
  trackRemoveFromFavorites(deletedProduct: Product, allFavoriteProducts: Product[]) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    // お気に入り商品の配列情報
    const items = allFavoriteProducts.map(product => ({
      item_id: product.id,
      name: product.name,
      price: product.price,
      item_url: `${baseUrl}/products/${product.id}`,
      item_image_url: product.imageUrl,
      l_category_name: product.category
    }));

    const totalPrice = allFavoriteProducts.reduce((sum, p) => sum + p.price, 0);
    const totalQuantity = allFavoriteProducts.length;

    this.pushToDataLayer('favorite', {
      price: totalPrice,
      quantity: totalQuantity,
      status: totalQuantity > 0,
      added_item_id: null,
      deleted_item_id: deletedProduct.id,
      items: items,
      item_ids: items.map(item => item.item_id),
      item_names: items.map(item => item.name),
      item_prices: items.map(item => item.price),
      item_urls: items.map(item => item.item_url),
      item_image_urls: items.map(item => item.item_image_url),
      l_category_names: items.map(item => item.l_category_name)
    });
  }

  // favorite: お気に入りページ閲覧時（お気に入り全体の状態を送信）
  trackViewFavorites(allFavoriteProducts: Product[]) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    // お気に入り商品の配列情報
    const items = allFavoriteProducts.map(product => ({
      item_id: product.id,
      name: product.name,
      price: product.price,
      item_url: `${baseUrl}/products/${product.id}`,
      item_image_url: product.imageUrl,
      l_category_name: product.category
    }));

    const totalPrice = allFavoriteProducts.reduce((sum, p) => sum + p.price, 0);
    const totalQuantity = allFavoriteProducts.length;

    this.pushToDataLayer('favorite', {
      price: totalPrice,
      quantity: totalQuantity,
      status: totalQuantity > 0,
      added_item_id: null,
      deleted_item_id: null,
      items: items,
      item_ids: items.map(item => item.item_id),
      item_names: items.map(item => item.name),
      item_prices: items.map(item => item.price),
      item_urls: items.map(item => item.item_url),
      item_image_urls: items.map(item => item.item_image_url),
      l_category_names: items.map(item => item.l_category_name)
    });
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();


