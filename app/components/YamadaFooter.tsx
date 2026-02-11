import Link from "next/link"

export default function YamadaFooter() {
  return (
    <footer className="bg-gray-50 border-t mt-12 md:mt-16">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Main Footer Content */}
        <div className="text-center mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Discount Nation</h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            世界中の人気ストアのクーポンコード・割引情報を毎日更新。お買い物をもっとお得に。
          </p>
        </div>

        {/* Footer Links */}
        <div className="border-t border-gray-200 pt-4 md:pt-6">
          {/* First Row of Links */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mb-3 md:mb-4 text-xs md:text-sm">
            <Link href="/om-oss" className="text-gray-600 hover:text-gray-900 transition-colors">
              会社概要
            </Link>
            <span className="text-gray-300 hidden sm:inline">&#x2022;</span>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
              よくある質問
            </Link>
            <span className="text-gray-300 hidden sm:inline">&#x2022;</span>
            <Link href="/kontakta-oss" className="text-gray-600 hover:text-gray-900 transition-colors">
              お問い合わせ
            </Link>
          </div>

          {/* Second Row of Links */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mb-4 md:mb-6 text-xs md:text-sm">
            <Link href="/anvandarvillkor" className="text-gray-600 hover:text-gray-900 transition-colors">
              利用規約
            </Link>
            <span className="text-gray-300 hidden sm:inline">&#x2022;</span>
            <Link href="/cookies" className="text-gray-600 hover:text-gray-900 transition-colors">
              クッキーポリシー
            </Link>
            <span className="text-gray-300 hidden sm:inline">&#x2022;</span>
            <Link href="/sekretesspolicy" className="text-gray-600 hover:text-gray-900 transition-colors">
              プライバシーポリシー
            </Link>
            <span className="text-gray-300 hidden sm:inline">&#x2022;</span>
            <Link href="/cookie-installningar" className="text-gray-600 hover:text-gray-900 transition-colors">
              クッキー設定
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-3 md:pt-4 text-center">
          <p className="text-xs md:text-sm text-gray-500">
            © {new Date().getFullYear()} Discount Nation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
