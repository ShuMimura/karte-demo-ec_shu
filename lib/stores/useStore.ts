import { create } from 'zustand';
import { Product, CartItem, User } from '../types';
import { storage } from '../utils/storage';
import { productService } from '../services/productService';
import { authService } from '../services/authService';
import { analyticsService } from '../services/analyticsService';

const CART_KEY = 'karte_demo_cart';

interface StoreState {
  // Cart state
  cart: CartItem[];
  
  // User state
  user: User | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  showCartNotification: boolean;
  
  // Cart actions
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => Promise<number>;
  getCartItems: () => Promise<Array<CartItem & { product: Product }>>;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  updateUserAttributes: (attributes: { birthday?: string; age?: number; gender?: 'male' | 'female' | 'other' }) => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hideCartNotification: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  cart: storage.get<CartItem[]>(CART_KEY) || [],
  user: null,
  isLoading: false,
  error: null,
  showCartNotification: false,

  // Cart actions
  addToCart: async (product: Product, quantity: number) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.productId === product.id);
    const isFirstItem = cart.length === 0;

    let newCart: CartItem[];
    if (existingItem) {
      newCart = cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { productId: product.id, quantity, addedAt: new Date() }];
    }

    storage.set(CART_KEY, newCart);
    set({ cart: newCart });

    // カートが空の状態から初めて追加された場合のみ通知を表示
    if (isFirstItem) {
      set({ showCartNotification: true });
    }

    // Track analytics - カート全体の情報を送信
    const allProducts = await productService.getProducts();
    analyticsService.trackAddToCart(product, quantity, newCart, allProducts);
  },

  removeFromCart: async (productId: string) => {
    const { cart } = get();
    const product = await productService.getProduct(productId);
    const newCart = cart.filter(item => item.productId !== productId);
    storage.set(CART_KEY, newCart);
    set({ cart: newCart });

    // Track analytics - カート全体の情報を送信
    if (product) {
      const allProducts = await productService.getProducts();
      analyticsService.trackRemoveFromCart(product, newCart, allProducts);
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    const { cart } = get();
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    storage.set(CART_KEY, newCart);
    set({ cart: newCart });

    // Track analytics - カート全体の情報を送信（数量変更時）
    const allProducts = await productService.getProducts();
    analyticsService.trackUpdateCart(newCart, allProducts);
  },

  clearCart: () => {
    storage.set(CART_KEY, []);
    set({ cart: [] });
  },

  getCartTotal: async () => {
    const { cart } = get();
    let total = 0;

    for (const item of cart) {
      const product = await productService.getProduct(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    return total;
  },

  getCartItems: async () => {
    const { cart } = get();
    const items: Array<CartItem & { product: Product }> = [];

    for (const item of cart) {
      const product = await productService.getProduct(item.productId);
      if (product) {
        items.push({ ...item, product });
      }
    }

    return items;
  },

  // Auth actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(email, password);
      set({ user, isLoading: false });
      // identifyイベント、attributeイベント、loginイベントを送信
      analyticsService.trackLogin(user.id, user.name, user.email, user.birthday, user.age, user.gender);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(email, password, name);
      set({ user, isLoading: false });
      // identifyイベント、attributeイベント、signupイベントを送信
      analyticsService.trackRegister(user.id, name, email, user.birthday, user.age, user.gender);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null });
  },

  checkAuth: () => {
    const user = authService.getCurrentUser();
    set({ user });
  },

  updateUserAttributes: async (attributes: { birthday?: string; age?: number; gender?: 'male' | 'female' | 'other' }) => {
    const { user } = get();
    if (!user) {
      throw new Error('ログインしてください');
    }

    set({ isLoading: true, error: null });
    try {
      const updatedUser = await authService.updateUserAttributes(user.id, attributes);
      set({ user: updatedUser, isLoading: false });
      
      // attributeイベントを送信
      analyticsService.trackAttribute(updatedUser.id, updatedUser.birthday, updatedUser.age, updatedUser.gender);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Utility actions
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  hideCartNotification: () => set({ showCartNotification: false }),
}));


