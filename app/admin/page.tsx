'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { productService } from '@/lib/services/productService';
import { analyticsService } from '@/lib/services/analyticsService';
import Button from '../components/Button';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    analyticsService.trackPageView('admin');
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この商品を削除してもよろしいですか？')) return;
    
    await productService.deleteProduct(id);
    await loadProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingProduct({
      id: '',
      name: '',
      price: 0,
      description: '',
      imageUrl: '/images/product-placeholder.jpg',
      category: 'electronics',
      stock: 0
    });
    setIsCreating(true);
  };

  const handleExportJSON = () => {
    const json = productService.exportAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    a.click();
  };

  const handleExportCSV = () => {
    const csv = productService.exportAsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
  };

  const handleReset = async () => {
    if (!confirm('商品データを初期状態にリセットしますか？')) return;
    await productService.resetToDefault();
    await loadProducts();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">商品管理</h1>
        <div className="flex gap-2">
          <Button onClick={handleCreate} variant="primary">
            + 新規追加
          </Button>
        </div>
      </div>

      {/* Export & Reset Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3 text-gray-900">📊 データエクスポート（KARTE Datahub用）</h2>
        <div className="flex gap-3">
          <Button onClick={handleExportJSON} variant="secondary">
            JSON形式でエクスポート
          </Button>
          <Button onClick={handleExportCSV} variant="secondary">
            CSV形式でエクスポート
          </Button>
          <Button onClick={handleReset} variant="danger">
            初期データにリセット
          </Button>
        </div>
        <p className="text-sm text-gray-800 mt-3">
          エクスポートしたファイルをKARTE Datahubにアップロードすることで、商品レコメンドや分析が可能になります
        </p>
      </div>

      {/* Edit/Create Form */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          isCreating={isCreating}
          onSave={async (product) => {
            if (isCreating) {
              await productService.createProduct(product);
            } else {
              await productService.updateProduct(product.id, product);
            }
            setEditingProduct(null);
            setIsCreating(false);
            await loadProducts();
          }}
          onCancel={() => {
            setEditingProduct(null);
            setIsCreating(false);
          }}
        />
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">価格</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">在庫</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ¥{product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category === 'electronics' ? '電子機器' : 'アクセサリー'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">商品がありません</p>
          <Button onClick={handleCreate} className="mt-4">
            最初の商品を追加
          </Button>
        </div>
      )}
    </div>
  );
}

// Product Form Component
function ProductForm({
  product,
  isCreating,
  onSave,
  onCancel
}: {
  product: Product;
  isCreating: boolean;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        {isCreating ? '新規商品追加' : '商品編集'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              商品名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              価格 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              カテゴリ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
              required
            >
              <option value="electronics">電子機器</option>
              <option value="accessories">アクセサリー</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              在庫数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
              required
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            画像URL
          </label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="/images/product.jpg"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary">
            {isCreating ? '追加' : '更新'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
}


