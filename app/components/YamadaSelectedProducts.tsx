export default function YamadaSelectedProducts() {
  const products = [
    {
      number: 1,
      text: "ヤマダデンキの「WEB限定！厳選大特価」コーナーをチェックしましたか？オンライン限定のお買い得商品が毎日更新されています。",
    },
    {
      number: 2,
      text: "ご質問やお困りごとがありましたら、ヤマダデンキの「お客様サポート」ページで、よくある質問やお問い合わせ先をご確認いただけます。",
    },
    {
      number: 3,
      text: "ヤマダデンキでは年に数回、大規模なセールを開催しています。決算セール、新春初売り、ボーナスセールなどのお得な機会をお見逃しなく！",
    },
    {
      number: 4,
      text: "お近くの店舗が分からない場合は、ヤマダデンキの「店舗検索」ツールをご利用ください。LABI、テックランド、Tecc LIFE SELECTなど、お近くの店舗が見つかります。",
    },
  ]

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ヤマダデンキのおすすめ商品・サービス</h2>
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <div key={product.number} className="flex items-start gap-3">
              <span className="text-lg font-semibold text-gray-900 mt-1">{product.number}.</span>
              <p className="text-gray-700 leading-relaxed">{product.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
