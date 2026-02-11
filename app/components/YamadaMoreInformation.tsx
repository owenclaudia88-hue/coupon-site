export default function YamadaMoreInformation() {
  return (
    <section className="mt-12 prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ヤマダデンキについて詳しく</h2>

      <div className="bg-gray-50 rounded-lg p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ヤマダデンキとは</h3>
          <p className="text-gray-700">
            ヤマダデンキは、日本最大の家電量販チェーンです。全国約1,000店舗を展開し、家電製品はもちろん、家具・インテリア、日用品、リフォームサービスまで、「くらしまるごと」をコンセプトに幅広い商品・サービスを提供しています。
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ヤマダデンキで買い物するメリット</h3>
          <ul className="list-disc list-inside text-gray-700 flex flex-col gap-1">
            <li>業界最安値への挑戦と定期的なキャンペーン</li>
            <li>有名メーカーの豊富な品揃え</li>
            <li>ヤマダポイントによる高還元</li>
            <li>充実のアフターサービスとサポート</li>
            <li>全国の店舗でのお受け取り・相談が可能</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">人気カテゴリー</h3>
          <p className="text-gray-700">
            テレビ・オーディオ、パソコン・タブレット、スマートフォン、冷蔵庫・洗濯機、エアコン、ゲーミング、スマートホーム、カメラ、家具・インテリア、リフォーム
          </p>
        </div>
      </div>
    </section>
  )
}
