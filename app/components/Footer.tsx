export default function Footer() {
  return (
    <footer className="bg-[#232f3e] text-white mt-auto">
      <div className="bg-[#37475a] hover:bg-[#485769] transition cursor-pointer">
        <div className="max-w-[1500px] mx-auto px-4 py-4 text-center text-sm">
          トップに戻る
        </div>
      </div>
      
      <div className="max-w-[1500px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3 text-base">商品について</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/products" className="hover:underline">
                  すべての商品
                </a>
              </li>
              <li>
                <a href="/products?search=electronics" className="hover:underline">
                  電子機器
                </a>
              </li>
              <li>
                <a href="/products?search=accessories" className="hover:underline">
                  アクセサリー
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 text-base">アカウント</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/mypage" className="hover:underline">
                  マイページ
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:underline">
                  カート
                </a>
              </li>
              <li>
                <a href="/auth/login" className="hover:underline">
                  ログイン
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 text-base">KARTE Demo EC について</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/" className="hover:underline">
                  ホーム
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:underline">
                  管理画面
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 text-base">ヘルプ</h3>
            <p className="text-sm text-gray-300">
              これはKARTE検証用の<br />デモECサイトです
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-[#131921]">
        <div className="max-w-[1500px] mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-400">
            <div className="mb-2">
              <span className="font-bold text-white">KARTE Demo EC</span>
            </div>
            <div>
              © 2025 KARTE Demo EC. All rights reserved. | KARTE検証用デモサイト
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


