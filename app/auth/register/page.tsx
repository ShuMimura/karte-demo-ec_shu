'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/stores/useStore';
import { analyticsService } from '@/lib/services/analyticsService';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, isLoading, error, setError } = useStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    analyticsService.trackPageView('register');
    
    // Already logged in, redirect to mypage
    if (user) {
      router.push('/mypage');
    }
  }, [user, router]);

  useEffect(() => {
    // Clear error when component unmounts
    return () => setError(null);
  }, [setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocalError(null);

    // Validation
    if (password !== confirmPassword) {
      setLocalError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setLocalError('パスワードは6文字以上で入力してください');
      return;
    }

    try {
      await register(email, password, name);
      router.push('/mypage');
    } catch (error) {
      // Error is already set in the store
      console.error('Registration failed:', error);
    }
  };

  const displayError = error || localError;

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 bg-[#eaeded]">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">新規登録</h1>

          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              name="name"
              label="お名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              required
            />

            <Input
              type="email"
              name="email"
              label="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />

            <Input
              type="password"
              name="password"
              label="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
              required
            />

            <Input
              type="password"
              name="confirmPassword"
              label="パスワード（確認）"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワードを再入力"
              required
            />

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? '登録中...' : '登録する'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              既にアカウントをお持ちの方は
            </p>
            <a 
              href="/auth/login" 
              className="text-[#16a085] hover:text-[#138d75] hover:underline font-medium"
            >
              ログイン
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              ※ これはデモサイトです。実際のパスワードは使用しないでください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


