"use client";

import { useState, useEffect } from "react";
import YamadaHeader from "../components/YamadaHeader";
import YamadaBreadcrumb from "../components/YamadaBreadcrumb";
import YamadaHeroSection from "../components/YamadaHeroSection";
import YamadaCouponCard from "../components/YamadaCouponCard";
import YamadaSidebar from "../components/YamadaSidebar";
import YamadaFooter from "../components/YamadaFooter";
import CouponModal from "../components/CouponModal";
import YamadaEmailSubscription from "../components/YamadaEmailSubscription";
import YamadaMoreInformation from "../components/YamadaMoreInformation";
import YamadaFAQ from "../components/YamadaFAQ";
import YamadaSelectedProducts from "../components/YamadaSelectedProducts";
import SliderPuzzleModal from "../../components/SliderPuzzleModal";
import OfferPopup from "../components/OfferPopup";
import GoogleTranslate from "../components/GoogleTranslate";

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  code?: string;
  uses: number;
  type: "percentage" | "amount" | "free" | "super";
  moreInfo?: string;
  expired?: boolean;
  offerUrl?: string;
  expirationDate?: string;
}

const topPromoCoupons: Coupon[] = [
  {
    id: "iphone-17-yamada",
    title: "特別キャンペーン – iPhone 17 Pro Max 最大70%OFF",
    description: "ヤマダデンキで最新iPhone 17 Pro Maxを大幅割引でゲット",
    discount: "70%",
    uses: 2847,
    type: "percentage",
    offerUrl: "/yamada/verify?id=iphone-17-yamada",
    expirationDate: "2025/9/15",
    moreInfo:
      "iPhone 17 Pro Maxの期間限定セール。最新機能を搭載したiPhoneを最大70%OFFで購入できます。コード不要 — レジにて自動適用されます。",
  },
  {
    id: "ymd-001",
    title: "全品最大40%OFF！ヤマダデンキ大決算セール",
    description: "家電・パソコン・生活用品など全商品が対象のビッグセール",
    discount: "40%",
    uses: 1563,
    type: "percentage",
    offerUrl: "/yamada/verify?id=ymd-001",
    expirationDate: "2025/8/31",
    moreInfo:
      "ヤマダデンキ全商品が対象の大決算セール。テレビ、パソコン、冷蔵庫、洗濯機など、人気家電がお買い得価格に。この機会をお見逃しなく。",
  },
  {
    id: "ymd-002",
    title: "スーパーセール - 対象商品最大60%OFF",
    description: "厳選された人気商品がスーパー特価で登場",
    discount: "SUPER",
    uses: 892,
    type: "super",
    offerUrl: "/yamada/verify?id=ymd-002",
    expirationDate: "2025/9/15",
    moreInfo:
      "ヤマダデンキのスーパーセール。対象商品が最大60%OFFの大特価。数量限定・期間限定のため、お早めにお求めください。",
  },
  {
    id: "ymd-003",
    title: "学生応援キャンペーン - 全品20%OFF",
    description: "学生証提示で全商品が20%割引",
    discount: "20%",
    uses: 1234,
    type: "percentage",
    offerUrl: "/yamada/verify?id=ymd-003",
    expirationDate: "2025/12/31",
    moreInfo:
      "学生の皆様を応援！学生証の提示で全商品が20%OFF。パソコン、タブレット、周辺機器など学業に必要な商品をお得に購入できます。",
  },
  {
    id: "free-delivery",
    title: "5,000円以上のお買い物で送料無料",
    description: "税込5,000円以上のご注文で標準配送料が無料に",
    discount: "無料",
    uses: 3247,
    type: "free",
    offerUrl: "/yamada/verify?id=free-delivery",
    expirationDate: "2025/12/31",
    moreInfo:
      "税込5,000円以上のお買い物で送料無料。対象商品は全カテゴリー。ご自宅まで直接お届けします。",
  },
  {
    id: "ymd-005",
    title: "テレビ50,000円引き（150,000円以上の商品対象）",
    description: "Samsung、LG、SONYなどの人気テレビが大幅値引き",
    discount: "50,000円",
    uses: 478,
    type: "amount",
    offerUrl: "/yamada/verify?id=ymd-005",
    expirationDate: "2025/9/30",
    moreInfo:
      "150,000円以上のテレビが50,000円引き。Samsung QLED、LG OLED、SONY BRAVIAなど全メーカーが対象。大画面テレビへの買い替えに最適です。",
  },
  {
    id: "ymd-006",
    title: "生活家電25%OFFキャンペーン",
    description: "冷蔵庫・洗濯機・電子レンジなどの生活家電が25%割引",
    discount: "25%",
    uses: 956,
    type: "percentage",
    offerUrl: "/yamada/verify?id=ymd-006",
    expirationDate: "2025/10/15",
    moreInfo:
      "生活家電が全品25%OFF。冷蔵庫、洗濯機、食洗機、電子レンジなどが対象。新生活の準備やお買い替えに最適なキャンペーンです。",
  },
  {
    id: "ymd-007",
    title: "パソコン・ノートPC 30,000円割引",
    description: "人気メーカーのパソコンがお買い得価格に",
    discount: "30,000円",
    uses: 692,
    type: "amount",
    offerUrl: "/yamada/verify?id=ymd-007",
    expirationDate: "2025/10/31",
    moreInfo:
      "HP、Dell、Lenovo、ASUS、FRONTIERなど人気メーカーのパソコンが30,000円引き。仕事用、学習用、ゲーミングPCなど幅広いラインナップが対象です。",
  },
  {
    id: "ymd-008",
    title: "ゲーミング用品30%OFFセール",
    description: "ヘッドセット、キーボード、マウス、ゲーミングチェアが割引",
    discount: "30%",
    uses: 1203,
    type: "percentage",
    offerUrl: "/yamada/verify?id=ymd-008",
    expirationDate: "2025/9/20",
    moreInfo:
      "ゲーミング用品が全品30%OFF。Razer、Logicool、SteelSeriesなどの人気ブランドが対象。TSUKUMOブランドのG-GEARゲーミングPCもお買い得です。",
  },
  {
    id: "ymd-009",
    title: "セール品からさらに15%OFF",
    description: "値下げ商品とクーポンの併用で最大限の節約を",
    discount: "15%",
    uses: 1445,
    type: "percentage",
    offerUrl: "/yamada/verify?id=ymd-009",
    expirationDate: "2025/8/31",
    moreInfo:
      "すでに値下げされた商品からさらに15%OFF。他のセールと組み合わせて、家電やテクノロジー製品を最大限お得に購入しましょう。",
  },
  {
    id: "ymd-010",
    title: "スマートフォン20,000円引き（80,000円以上の機種対象）",
    description: "最新iPhone・Galaxy・Pixelなどが大幅値引き",
    discount: "20,000円",
    uses: 567,
    type: "amount",
    offerUrl: "/yamada/verify?id=ymd-010",
    expirationDate: "2025/11/30",
    moreInfo:
      "80,000円以上のスマートフォンが20,000円引き。iPhone 16、Galaxy S25、Google Pixelなどの最新プレミアムスマホが対象です。",
  },
  {
    id: "ymd-011",
    title: "大型家電の設置・配送無料（100,000円以上）",
    description: "冷蔵庫・洗濯機・エアコンなどの設置工事費が無料",
    discount: "無料",
    uses: 834,
    type: "free",
    offerUrl: "/yamada/verify?id=ymd-011",
    expirationDate: "2025/12/31",
    moreInfo:
      "100,000円以上の大型家電をご購入の場合、配送・設置が無料になります。エアコンの取り付け、冷蔵庫や洗濯機の設置なども追加費用なしで対応します。",
  },
  {
    id: "ymd-012",
    title: "新規会員登録で10%OFF",
    description: "ヤマダポイント会員の新規登録で初回購入が割引に",
    discount: "10%",
    uses: 2892,
    type: "percentage",
    offerUrl: "/yamada/verify?id=ymd-012",
    expirationDate: "2025/12/31",
    moreInfo:
      "新規ポイント会員登録で初回購入が10%OFF。全商品が対象で、他のキャンペーンとの併用も可能です。アプリからの登録がお得です。",
  },
];

const expiredCoupons: Coupon[] = [
  {
    id: "ymd-exp-001",
    title: "年末大感謝祭 - テレビ50%OFF",
    description: "年末限定の大特価テレビセール",
    discount: "50%",
    uses: 4156,
    type: "percentage",
    expired: true,
    offerUrl: "/yamada/verify?id=ymd-exp-001",
    expirationDate: "2024/12/31",
    moreInfo:
      "年末大感謝祭のテレビ50%OFFキャンペーンは終了しました。次回の大型セールをお楽しみに。",
  },
  {
    id: "ymd-exp-002",
    title: "新春初売り - 全品送料無料",
    description: "お正月限定の送料無料キャンペーン",
    discount: "無料",
    uses: 5421,
    type: "free",
    expired: true,
    offerUrl: "/yamada/verify?id=ymd-exp-002",
    expirationDate: "2025/1/7",
    moreInfo:
      "新春初売りの全品送料無料キャンペーンは終了しました。期間中は注文金額に関わらず送料が無料でした。",
  },
  {
    id: "ymd-exp-003",
    title: "夏のボーナスセール - エアコン35%OFF",
    description: "夏季限定のエアコン大特価キャンペーン",
    discount: "35%",
    uses: 2567,
    type: "percentage",
    expired: true,
    offerUrl: "/yamada/verify?id=ymd-exp-003",
    expirationDate: "2024/8/31",
    moreInfo:
      "夏のボーナスセールのエアコン35%OFFキャンペーンは終了しました。暑い季節の人気キャンペーンでした。",
  },
  {
    id: "ymd-exp-004",
    title: "ブラックフライデー - ゲーミングPC 60,000円引き",
    description: "ブラックフライデー限定のゲーミングPC特別価格",
    discount: "60,000円",
    uses: 1234,
    type: "amount",
    expired: true,
    offerUrl: "/yamada/verify?id=ymd-exp-004",
    expirationDate: "2024/11/29",
    moreInfo:
      "ブラックフライデーのゲーミングPC 60,000円引きキャンペーンは終了しました。今年最大のゲーマー向けセールでした。",
  },
  {
    id: "ymd-exp-005",
    title: "新生活応援フェア - キッチン家電20%OFF",
    description: "春の新生活シーズン限定のキッチン家電セール",
    discount: "20%",
    uses: 1789,
    type: "percentage",
    expired: true,
    offerUrl: "/yamada/verify?id=ymd-exp-005",
    expirationDate: "2024/4/30",
    moreInfo:
      "新生活応援フェアのキッチン家電20%OFFキャンペーンは終了しました。炊飯器、電子レンジ、コーヒーメーカーなどが対象でした。",
  },
  {
    id: "ymd-exp-006",
    title: "決算セール - オーディオ機器45%OFF",
    description: "決算期限定のスピーカー・サウンドバー大特価",
    discount: "45%",
    uses: 1445,
    type: "percentage",
    expired: true,
    offerUrl: "/yamada/verify?id=ymd-exp-006",
    expirationDate: "2024/3/31",
    moreInfo:
      "決算セールのオーディオ機器45%OFFキャンペーンは終了しました。スピーカー、サウンドバー、ヘッドフォンなどが大幅値引きでした。",
  },
  {
    id: "ymd-exp-007",
    title: "お盆セール - 大型家電の配送無料",
    description: "お盆期間限定の冷蔵庫・洗濯機配送無料キャンペーン",
    discount: "無料",
    uses: 2678,
    type: "free",
    expired: true,
    offerUrl: "/yamada/verify?id=ymd-exp-007",
    expirationDate: "2024/8/16",
    moreInfo:
      "お盆セールの大型家電配送無料キャンペーンは終了しました。冷蔵庫や洗濯機の配送・設置が無料でした。",
  },
];

export default function YamadaPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  const fireClickConversionNoRedirect = () => {
    try {
      const w = window as any;
      if (typeof w.gtag === "function") {
        w.gtag("event", "conversion", {
          send_to: "AW-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        });
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOfferPopup(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCouponSelect = (coupon: Coupon) => {
    fireClickConversionNoRedirect();
    const newUrl = `/yamada/offer/${coupon.id}#td-offer${coupon.id}`;
    window.history.pushState({ offerId: coupon.id }, "", newUrl);
    setSelectedCoupon(coupon);
  };

  const handleModalClose = () => {
    window.history.pushState({}, "", "/yamada");
    setSelectedCoupon(null);
  };

  const getDiscountDisplay = (discount: string, type: string) => {
    if (type === "super") return "スーパー割引";
    if (type === "free") return "無料特典";
    return `${discount} 割引`;
  };

  const topOffer = {
    title: "iPhone 17 Pro Max 最大70%OFF",
    discount: "70%",
    description: "ヤマダデンキで最新iPhone 17 Pro Maxを大幅割引でゲット",
    offerUrl: "/yamada/verify?id=iphone-17-yamada",
  };

  return (
    <div className="min-h-screen bg-white">
      <YamadaHeader />
      <GoogleTranslate autoTranslateTo="ja" />
      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="hidden md:block">
          <YamadaBreadcrumb storeName="ヤマダデンキ" />
        </div>
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 mt-4 md:mt-6">
          <div className="flex-1 min-w-0">
            <YamadaHeroSection />

            {/* iPhone Special Promotion */}
            <div className="mt-6 md:mt-8 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 rounded-lg p-4 md:p-6 border-2 border-red-200 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg sm:text-xl w-fit">
                    70%
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      特別キャンペーン – iPhone 17 Pro Max 最大70%OFF
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      ヤマダデンキで最新iPhone 17 Pro Maxを大幅割引でゲット
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      コード不要 – レジにて自動適用されます
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const iphoneCoupon: Coupon = {
                      id: "iphone-17-yamada",
                      title: "iPhone 17 Pro Max - 最大70%OFF",
                      description:
                        "ヤマダデンキで最新iPhone 17 Pro Maxを大幅割引でゲット",
                      discount: "70%",
                      uses: 2847,
                      type: "percentage",
                      offerUrl: "/yamada/verify?id=iphone-17-yamada",
                    };
                    handleCouponSelect(iphoneCoupon);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full sm:w-auto text-center"
                >
                  クーポンを使う
                </button>
              </div>
            </div>

            {/* Top Promo Codes Section */}
            <section className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                ヤマダデンキ 人気クーポンコード（
                {new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                ）
              </h2>
              <div className="text-xs md:text-sm text-gray-500 mb-4">
                お買い物の際にアフィリエイト報酬が発生する場合があります。
              </div>
              <div className="flex flex-col gap-3 md:gap-4">
                {topPromoCoupons.map((coupon) => (
                  <YamadaCouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onSelectCoupon={() => handleCouponSelect(coupon)}
                  />
                ))}
              </div>
            </section>

            {/* Email Subscription */}
            <YamadaEmailSubscription />

            {/* Current Coupon Codes Table */}
            <section className="mt-8 md:mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                ヤマダデンキ 現在有効なクーポンコード
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                          割引
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                          説明
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 hidden sm:table-cell">
                          有効期限
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topPromoCoupons.map((coupon) => (
                        <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <span
                              className={`font-bold text-sm md:text-lg ${
                                coupon.type === "super"
                                  ? "text-red-600"
                                  : coupon.type === "free"
                                  ? "text-red-600"
                                  : "text-red-600"
                              }`}
                            >
                              {getDiscountDisplay(coupon.discount, coupon.type)}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <div>
                              <p className="text-gray-900 font-medium text-sm md:text-base leading-tight">
                                {coupon.title}
                              </p>
                              <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">
                                {coupon.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 sm:hidden">
                                {coupon.expirationDate}
                              </p>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                            <span className="text-gray-900 text-sm md:text-base">
                              {coupon.expirationDate}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Expired Codes */}
            <section className="mt-8 md:mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                期限切れクーポンコード
              </h2>
              <div className="flex flex-col gap-3 md:gap-4">
                {expiredCoupons.map((coupon) => (
                  <YamadaCouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onSelectCoupon={() => handleCouponSelect(coupon)}
                  />
                ))}
              </div>
            </section>

            {/* More Information */}
            <YamadaMoreInformation />

            {/* Selected Products Section */}
            <YamadaSelectedProducts />

            {/* FAQ Section */}
            <YamadaFAQ />
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0">
            <YamadaSidebar />
          </div>
        </div>
      </main>
      <YamadaFooter />
      {selectedCoupon && (
        <CouponModal
          coupon={selectedCoupon}
          onClose={handleModalClose}
          storeName="ヤマダデンキ"
        />
      )}
      <SliderPuzzleModal
        isOpen={showPuzzleModal}
        onClose={() => setShowPuzzleModal(false)}
        destinationUrl={selectedCoupon?.offerUrl}
      />

      <OfferPopup
        isOpen={showOfferPopup}
        onClose={() => setShowOfferPopup(false)}
        storeName="ヤマダデンキ"
        offer={topOffer}
      />
    </div>
  );
}
