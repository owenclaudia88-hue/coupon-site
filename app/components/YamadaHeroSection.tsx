export default function YamadaHeroSection() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 md:mb-8">
      <div className="w-32 h-10 sm:w-40 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200 p-2 flex-shrink-0">
        <img src="/images/yamada-logo.png" alt="ヤマダデンキ ロゴ" className="w-full h-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">ヤマダデンキ クーポンコード</h1>
        <p className="text-red-600 text-base sm:text-lg mt-1">
          家電・日用品・家具など幅広い商品をお得に購入 — 毎日更新中
        </p>
      </div>
    </div>
  )
}
