"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Globe } from "lucide-react"

export default function YamadaSidebar() {
  const [discountForm, setDiscountForm] = useState({
    website: "",
    code: "",
    description: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const activeDiscounts = 13
  const expiredDiscounts = 7
  const totalOffers = activeDiscounts + expiredDiscounts
  const bestDiscount = "70%"
  const bestMonetaryDiscount = "50,000円"
  const averageSavings = "15,000円"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setDiscountForm({ website: "", code: "", description: "" })
      setIsSubmitted(false)
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDiscountForm({
      ...discountForm,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">クーポン概要</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">最大割引:</span>
            <span className="font-semibold text-red-600">{bestDiscount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">最大節約額:</span>
            <span className="font-semibold text-red-600">{bestMonetaryDiscount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">クーポンコード:</span>
            <span className="font-semibold">{activeDiscounts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">全オファー数:</span>
            <span className="font-semibold">{totalOffers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">平均節約額:</span>
            <span className="font-semibold text-red-600">{averageSavings}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ヤマダデンキのゲーミング</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          ヤマダデンキでは、ゲーマーに必要なすべてを幅広く取り揃えています。VRヘッドセット、ゲーミングキーボード、PlayStation 5、最新のゲームソフトなど、豊富な品揃えでお待ちしています。TSUKUMOブランドのBTOパソコンも大人気です。
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">iPhone x ヤマダデンキ</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Apple製品をお探しなら、ヤマダデンキがおすすめです。最新のiPhoneモデルをお得な価格で購入でき、ケースやアクセサリーも豊富に揃っています。AppleCareもヤマダデンキで加入可能です。
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ヤマダポイント会員</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          ヤマダデンキのポイント会員になると、お買い物金額に応じてポイントが貯まります。貯まったポイントは次回のお買い物で1ポイント＝1円として使えます。アプリ会員ならさらにお得な特典も満載です。
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ヤマダデンキの豊富な品揃え</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          ヤマダデンキでは、テレビ、パソコン、スマートフォン、冷蔵庫、洗濯機、エアコンなどの家電はもちろん、家具やインテリア、日用品まで幅広く取り揃えています。「くらしまるごと」をコンセプトに、住まいに関するすべてをご提案します。
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ヤマダウェブコム</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          ヤマダデンキのオンラインショップ「ヤマダウェブコム」では、店頭と同じ商品をオンラインでお得に購入できます。WEB限定の厳選大特価商品や、ポイント還元キャンペーンも随時開催中です。
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ヤマダデンキの店舗</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          ヤマダデンキは日本全国に約1,000店舗を展開しています。LABI、テックランド、Tecc LIFE SELECTなど、様々な店舗形態でお客様のニーズにお応えします。お近くの店舗で実際に商品をお試しいただけます。
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ヤマダデンキ お問い合わせ</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <div>〒370-0841</div>
              <div>群馬県高崎市栄町1番1号</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
            <a href="tel:0120-078-178" className="text-sm text-red-600 hover:underline">
              0120-078-178
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-red-600 flex-shrink-0" />
            <a
              href="https://www.yamada-denki.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-red-600 hover:underline"
            >
              yamada-denki.jp
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">クーポンコードを共有</h3>
        <p className="text-sm text-gray-600 mb-4">
          見逃しているクーポンコードやオファーがあれば、ぜひ共有してください！
        </p>

        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-green-600 font-semibold mb-2">ご協力ありがとうございます！</div>
            <p className="text-sm text-green-700">
              クーポンコードを確認し、有効であれば追加いたします。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="website"
              value={discountForm.website}
              onChange={handleInputChange}
              placeholder="yamada-denki.jp"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="text"
              name="code"
              value={discountForm.code}
              onChange={handleInputChange}
              placeholder="クーポンコード"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <textarea
              name="description"
              value={discountForm.description}
              onChange={handleInputChange}
              placeholder="説明"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
            >
              コードを送信
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
