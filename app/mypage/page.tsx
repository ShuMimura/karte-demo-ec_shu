'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/stores/useStore';
import { analyticsService } from '@/lib/services/analyticsService';
import Button from '../components/Button';
import Input from '../components/Input';

export default function MyPage() {
  const router = useRouter();
  const { user, logout, checkAuth, updateUserAttributes } = useStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const check = async () => {
      checkAuth();
      setIsChecking(false);
    };
    check();
  }, [checkAuth]);

  useEffect(() => {
    // checkAuthが完了するまで待つ
    if (isChecking) return;
    
    if (user) {
      analyticsService.trackPageView('mypage', { user_id: user.id });
      // 編集フォームに現在の値を設定
      setBirthday(user.birthday || '');
      setAge(user.age?.toString() || '');
      setGender(user.gender || 'male');
    } else {
      // Not logged in, redirect to login
      router.push('/auth/login');
    }
  }, [user, router, isChecking]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserAttributes({
        birthday: birthday || undefined,
        age: age ? parseInt(age) : undefined,
        gender: gender
      });
      setIsEditing(false);
    } catch (error) {
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setBirthday(user.birthday || '');
      setAge(user.age?.toString() || '');
      setGender(user.gender || 'male');
    }
    setIsEditing(false);
  };

  if (!user) {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">マイページ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
            <span>👤</span>
            ユーザー情報
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">お名前</label>
              <p className="text-lg font-medium text-gray-900">{user.name}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">メールアドレス</label>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">会員ID</label>
              <p className="text-sm text-gray-500 font-mono">{user.id}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">登録日</label>
              <p className="text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
        </div>

        {/* User Attributes Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-900">
              <span>📝</span>
              属性情報
            </h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="secondary" className="text-sm">
                編集
              </Button>
            )}
          </div>
          
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">誕生日</label>
                <p className="text-lg font-medium text-gray-900">{user.birthday || '未設定'}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">年齢</label>
                <p className="text-lg font-medium text-gray-900">{user.age !== undefined ? `${user.age}歳` : '未設定'}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">性別</label>
                <p className="text-lg font-medium text-gray-900">
                  {user.gender === 'male' ? '男性' : user.gender === 'female' ? '女性' : user.gender === 'other' ? 'その他' : '未設定'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 block mb-1">誕生日</label>
                <Input
                  type="date"
                  name="birthday"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-700 block mb-1">年齢</label>
                <Input
                  type="number"
                  name="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-700 block mb-1">性別</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-transparent"
                >
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} fullWidth disabled={saving}>
                  {saving ? '保存中...' : '保存'}
                </Button>
                <Button onClick={handleCancel} fullWidth variant="secondary" disabled={saving}>
                  キャンセル
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
          <span>⚡</span>
          クイックアクション
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => router.push('/products')}
            fullWidth
            variant="secondary"
          >
            商品を探す
          </Button>
          
          <Button
            onClick={() => router.push('/cart')}
            fullWidth
            variant="secondary"
          >
            カートを見る
          </Button>
          
          <Button
            onClick={handleLogout}
            fullWidth
            variant="danger"
          >
            ログアウト
          </Button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          ようこそ、{user.name}さん！
        </h3>
        <p className="text-blue-800">
          KARTE Demo ECサイトをご利用いただきありがとうございます。
          このサイトではKARTEの各種機能を検証することができます。
        </p>
      </div>
    </div>
  );
}

