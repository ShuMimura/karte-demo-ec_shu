import { Product } from '../types';
import productsData from '../data/products.json';
import { storage } from '../utils/storage';

const PRODUCTS_KEY = 'karte_demo_products';

export class ProductService {
  private products: Product[];

  constructor() {
    // Try to load from localStorage first, fallback to JSON file
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY);
    if (storedProducts && storedProducts.length > 0) {
      this.products = storedProducts;
    } else {
      this.products = productsData.products;
      // Save initial data to localStorage
      storage.set(PRODUCTS_KEY, this.products);
    }
  }

  async getProducts(): Promise<Product[]> {
    // Reload from storage to get latest data
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY);
    if (storedProducts) {
      this.products = storedProducts;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products;
  }

  async getProduct(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY);
    if (storedProducts) {
      this.products = storedProducts;
    }
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY);
    if (storedProducts) {
      this.products = storedProducts;
    }
    const lowerQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY);
    if (storedProducts) {
      this.products = storedProducts;
    }
    return this.products.filter(p => p.category === category);
  }

  // Admin functions
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY) || [];
    
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`
    };
    
    const updatedProducts = [...storedProducts, newProduct];
    storage.set(PRODUCTS_KEY, updatedProducts);
    this.products = updatedProducts;
    
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY) || [];
    
    const index = storedProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    const updatedProduct = { ...storedProducts[index], ...updates, id };
    storedProducts[index] = updatedProduct;
    
    storage.set(PRODUCTS_KEY, storedProducts);
    this.products = storedProducts;
    
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY) || [];
    
    const filteredProducts = storedProducts.filter(p => p.id !== id);
    if (filteredProducts.length === storedProducts.length) {
      return false; // Product not found
    }
    
    storage.set(PRODUCTS_KEY, filteredProducts);
    this.products = filteredProducts;
    
    return true;
  }

  async resetToDefault(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    storage.set(PRODUCTS_KEY, productsData.products);
    this.products = productsData.products;
  }

  // Export functions for Datahub
  exportAsJSON(): string {
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY) || [];
    return JSON.stringify(storedProducts, null, 2);
  }

  exportAsCSV(): string {
    const storedProducts = storage.get<Product[]>(PRODUCTS_KEY) || [];
    
    // CSV Header
    const headers = ['id', 'name', 'price', 'description', 'imageUrl', 'category', 'stock'];
    const csvRows = [headers.join(',')];
    
    // CSV Rows
    storedProducts.forEach(product => {
      const row = [
        product.id,
        `"${product.name.replace(/"/g, '""')}"`,
        product.price,
        `"${product.description.replace(/"/g, '""')}"`,
        product.imageUrl,
        product.category,
        product.stock
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }
}

// Singleton instance
export const productService = new ProductService();
