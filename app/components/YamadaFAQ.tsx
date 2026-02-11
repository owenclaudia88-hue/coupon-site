"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "ヤマダデンキで使えるクーポンコードはありますか？",
    answer:
      "現在、ヤマダデンキで使えるクーポンコードが12種類あります。これらのクーポンは多くのお客様にご利用いただいており、最終確認日は2025年8月3日です。",
  },
  {
    question: "ヤマダデンキでいくら節約できますか？",
    answer:
      "過去30日間で、お客様は12種類のクーポンコードやオファーを利用して、最大50,000円の節約を実現されています。",
  },
  {
    question: "ヤマダデンキの最もお得なクーポンの探し方は？",
    answer:
      "12種類のクーポンコードをすべて試して、最もお得なものを見つけてください。当サイトではヤマダデンキの最新クーポン情報を常に更新しています。",
  },
  {
    question: "ヤマダデンキに学生割引はありますか？",
    answer:
      "はい、ヤマダデンキでは学生向けの特別割引を実施しています。学生証の提示で対象商品が割引になります。詳細は店頭またはオンラインストアでご確認ください。",
  },
  {
    question: "ヤマダデンキのポイント制度とは？",
    answer:
      "ヤマダデンキでは、お買い物金額に応じてヤマダポイントが付与されます。基本還元率は商品により異なりますが、1ポイント＝1円として次回のお買い物に使えます。アプリ会員登録でさらにお得になります。",
  },
  {
    question: "ヤマダウェブコムとは何ですか？",
    answer:
      "ヤマダウェブコムはヤマダデンキの公式オンラインショップです。家電から家具・日用品まで幅広い商品を取り扱っており、WEB限定の特別価格やポイント還元キャンペーンも実施しています。",
  },
  {
    question: "ヤマダデンキの店舗は何店舗ありますか？",
    answer:
      "ヤマダデンキは日本全国に約1,000店舗を展開しています。LABI（都市型大型店）、テックランド、Tecc LIFE SELECT、家電住まいる館など、多様な店舗形態でサービスを提供しています。",
  },
  {
    question: "ヤマダデンキへの問い合わせ方法は？",
    answer:
      "ヤマダデンキへのお問い合わせは、フリーダイヤル0120-078-178（受付時間：10:00〜19:00）またはWebサイトのお問い合わせフォームからご連絡いただけます。",
  },
  {
    question: "TSUKUMOとは何ですか？",
    answer:
      "TSUKUMOはヤマダデンキグループの自作PC・PCパーツ専門店です。ゲーミングPCブランド「G-GEAR」をはじめ、自作PCパーツや周辺機器を専門的に取り扱っています。",
  },
  {
    question: "ヤマダデンキのリフォームサービスとは？",
    answer:
      "ヤマダデンキでは「くらしまるごと」をコンセプトに、キッチン・バスルーム・トイレなどのリフォームサービスも提供しています。ヤマダホームズと連携した住まいの総合提案が可能です。",
  },
  {
    question: "ヤマダデンキの配送・設置サービスは？",
    answer:
      "ヤマダデンキでは、大型家電の配送・設置サービスを提供しています。エアコンの取り付け、冷蔵庫や洗濯機の設置なども対応可能です。配送料や設置費用は商品や地域によって異なります。",
  },
]

export default function YamadaFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ヤマダデンキに関するよくある質問（FAQ）</h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 pr-4">{item.question}</h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </div>
            </button>
            {openItems.includes(index) && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
