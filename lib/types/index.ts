// Product Types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Analytics Types
export interface AnalyticsEvent {
  eventName: string;
  parameters: Record<string, any>;
  userId?: string;
  timestamp: Date;
}

// Error Types
export enum ErrorType {
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
}


