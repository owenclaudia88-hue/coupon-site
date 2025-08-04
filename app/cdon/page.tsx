"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Breadcrumb from "../components/Breadcrumb"
import CDONHeroSection from "../components/CDONHeroSection"
import CouponCard from "../components/CouponCard"
import CDONSidebar from "../components/CDONSidebar"
import Footer from "../components/Footer"
import CouponModal from "../components/CouponModal"
import EmailSubscription from "../components/EmailSubscription"
import CDONMoreInformation from "../components/CDONMoreInformation"
import CDONFAQ from "../components/CDONFAQ"
import CDONSelectedProducts from "../components/CDONSelectedProducts"
import SliderPuzzleModal from "../../components/SliderPuzzleModal"

interface Coupon {
  id: string
  title: string
  description: string
  discount: string
  code?: string
  uses: number
  type: "percentage" | "amount" | "free" | "super"
  moreInfo?: string
  expired?: boolean
  offerUrl?: string
  expirationDate?: string
}

const topPromoCoupons: Coupon[] = [
  {
    id: "cdon-001",
    title: "Upp till 60% rabatt på elektronik",
    description: "Spara stort på TV-apparater, ljudsystem och elektronik",
    discount: "60%",
    uses: 789,
    type: "percentage",
    offerUrl: "https://cdon.se",
    expirationDate: "30/9/2025",
    moreInfo:
      "Gäller utvalda elektronikprodukter från Samsung, Sony, LG och andra märken. Rabatten tillämpas automatiskt på kvalificerade produkter.",
  },
  {
    id: "cdon-002",
    title: "2000 kr rabatt på smartphones över 10000 kr",
    description: "Exklusiv rabatt på iPhone och Samsung Galaxy telefoner",
    discount: "2000 kr",
    uses: 345,
    type: "amount",
    offerUrl: "https://cdon.se",
    expirationDate: "15/10/2025",
    moreInfo:
      "Gäller smartphones över 10000 kr från Apple iPhone och Samsung Galaxy serien. Perfekt tillfälle att uppgradera till senaste tekniken.",
  },
  {
    id: "cdon-003",
    title: "Fri frakt på alla beställningar över 299 kr",
    description: "Få gratis frakt när du handlar för minst 299 kr",
    discount: "GRATIS",
    uses: 1567,
    type: "free",
    offerUrl: "https://cdon.se",
    expirationDate: "31/12/2025",
    moreInfo: "Fri standardfrakt på alla produkter vid köp över 299 kr. Gäller alla säljare på CDON Marketplace.",
  },
  {
    id: "cdon-004",
    title: "50% rabatt på hörlurar och ljudprodukter",
    description: "Spara på Sony, Bose, JBL och andra ljudmärken",
    discount: "50%",
    uses: 456,
    type: "percentage",
    offerUrl: "https://cdon.se",
    expirationDate: "25/9/2025",
    moreInfo: "Gäller hörlurar, högtalare och ljudsystem från alla populära märken. Begränsat antal produkter.",
  },
  {
    id: "cdon-005",
    title: "1800 kr rabatt på laptops över 12000 kr",
    description: "Spara på bärbara datorer från HP, Dell och Lenovo",
    discount: "1800 kr",
    uses: 234,
    type: "amount",
    offerUrl: "https://cdon.se",
    expirationDate: "31/10/2025",
    moreInfo: "Gäller laptops över 12000 kr från HP, Dell, Lenovo och ASUS. Perfekt för studier, arbete eller gaming.",
  },
  {
    id: "cdon-006",
    title: "40% rabatt på gaming-produkter",
    description: "Spara på spelkonsoler, spel och gaming-tillbehör",
    discount: "40%",
    uses: 567,
    type: "percentage",
    offerUrl: "https://cdon.se",
    expirationDate: "20/9/2025",
    moreInfo: "Gäller PlayStation, Xbox, Nintendo och gaming-tillbehör från olika säljare på CDON.",
  },
  {
    id: "cdon-007",
    title: "Superrea - Upp till 70% på utvalda produkter",
    description: "Begränsad superrea med enorma rabatter",
    discount: "SUPER",
    uses: 123,
    type: "super",
    offerUrl: "https://cdon.se",
    expirationDate: "8/9/2025",
    moreInfo: "Superrea med upp till 70% rabatt på utvalda produkter från olika kategorier. Begränsat antal och tid.",
  },
  {
    id: "cdon-008",
    title: "30% rabatt på hem och trädgård",
    description: "Spara på möbler, inredning och trädgårdsprodukter",
    discount: "30%",
    uses: 678,
    type: "percentage",
    offerUrl: "https://cdon.se",
    expirationDate: "15/10/2025",
    moreInfo: "Gäller hem- och trädgårdsprodukter från olika märken och leverantörer på CDON Marketplace.",
  },
  {
    id: "cdon-009",
    title: "1200 kr rabatt på kameror över 8000 kr",
    description: "Spara på digitalkameror från Canon, Nikon och Sony",
    discount: "1200 kr",
    uses: 189,
    type: "amount",
    offerUrl: "https://cdon.se",
    expirationDate: "30/11/2025",
    moreInfo: "Gäller digitalkameror över 8000 kr från Canon, Nikon, Sony och Fujifilm.",
  },
  {
    id: "cdon-010",
    title: "35% rabatt på mode och kläder",
    description: "Spara på kläder, skor och modeaccessoarer",
    discount: "35%",
    uses: 345,
    type: "percentage",
    offerUrl: "https://cdon.se",
    expirationDate: "25/10/2025",
    moreInfo: "Gäller mode och kläder från olika märken och designers på CDON Marketplace.",
  },
  {
    id: "cdon-011",
    title: "25% rabatt på böcker och media",
    description: "Spara på böcker, filmer, musik och spel",
    discount: "25%",
    uses: 567,
    type: "percentage",
    offerUrl: "https://cdon.se",
    expirationDate: "31/12/2025",
    moreInfo: "Gäller böcker, DVD-filmer, Blu-ray, musik-CD och TV-spel från olika säljare.",
  },
  {
    id: "cdon-012",
    title: "20% rabatt för nya kunder",
    description: "Välkomstrabatt för förstagångskunder hos CDON",
    discount: "20%",
    uses: 892,
    type: "percentage",
    offerUrl: "https://cdon.se",
    expirationDate: "31/12/2025",
    moreInfo: "20% välkomstrabatt för nya kunder på första köpet. Registrera dig som ny kund och börja spara.",
  },
  {
    id: "cdon-013",
    title: "1500 kr rabatt på vitvaror över 8000 kr",
    description: "Spara på kylskåp, tvättmaskiner och andra vitvaror",
    discount: "1500 kr",
    uses: 234,
    type: "amount",
    offerUrl: "https://cdon.se",
    expirationDate: "15/11/2025",
    moreInfo: "Gäller vitvaror över 8000 kr från Bosch, Siemens, Electrolux och andra märken.",
  },
  {
    id: "cdon-014",
    title: "45% rabatt på sport och fritid",
    description: "Spara på träningsutrustning och fritidsartiklar",
    discount: "45%",
    uses: 456,
    type: "percentage",
    offerUrl: "https://cdon.se",
    expirationDate: "30/9/2025",
    moreInfo: "Gäller sport- och fritidsprodukter från olika märken och leverantörer.",
  },
  {
    id: "cdon-015",
    title: "Fri retur inom 30 dagar",
    description: "Returnera dina köp kostnadsfritt inom 30 dagar",
    discount: "GRATIS",
    uses: 1234,
    type: "free",
    offerUrl: "https://cdon.se",
    expirationDate: "31/12/2025",
    moreInfo: "Utökad returperiod på 30 dagar på utvalda produkter. Inga frågor ställs vid retur.",
  },
]

const expiredCoupons: Coupon[] = [
  {
    id: "cdon-exp-001",
    title: "Black Friday - 65% rabatt på elektronik",
    description: "Historisk Black Friday-rabatt på elektronikprodukter",
    discount: "65%",
    uses: 2156,
    type: "percentage",
    expired: true,
    offerUrl: "https://cdon.se",
    expirationDate: "30/11/2024",
    moreInfo:
      "Denna fantastiska Black Friday-rabatt på elektronik har tyvärr gått ut. Håll utkik efter liknande erbjudanden under kommande kampanjperioder.",
  },
  {
    id: "cdon-exp-002",
    title: "Julrea - Fri frakt på allt",
    description: "Julkampanj med fri frakt oavsett belopp",
    discount: "GRATIS",
    uses: 3421,
    type: "free",
    expired: true,
    offerUrl: "https://cdon.se",
    expirationDate: "31/12/2024",
    moreInfo:
      "Julkampanjen med fri frakt på alla beställningar har avslutats. Under kampanjen kunde kunder få fri frakt oavsett orderbelopp.",
  },
  {
    id: "cdon-exp-003",
    title: "Sommarrea - 40% rabatt på mode",
    description: "Sommarkampanj på kläder och accessoarer",
    discount: "40%",
    uses: 567,
    type: "percentage",
    expired: true,
    offerUrl: "https://cdon.se",
    expirationDate: "31/7/2024",
    moreInfo:
      "Sommarens modekampanj med 40% rabatt på kläder och accessoarer har gått ut. Kampanjen var mycket populär bland modeintresserade.",
  },
  {
    id: "cdon-exp-004",
    title: "Cyber Monday - 3000 kr rabatt på laptops",
    description: "Exklusiv Cyber Monday-rabatt på bärbara datorer",
    discount: "3000 kr",
    uses: 234,
    type: "amount",
    expired: true,
    offerUrl: "https://cdon.se",
    expirationDate: "27/11/2024",
    moreInfo:
      "Cyber Monday-erbjudandet med 3000 kr rabatt på laptops har avslutats. Detta var ett av årets bästa erbjudanden för dem som behövde en ny dator.",
  },
  {
    id: "cdon-exp-005",
    title: "Påskrea - 30% rabatt på hem och trädgård",
    description: "Påskkampanj på hemprodukter och trädgårdstillbehör",
    discount: "30%",
    uses: 789,
    type: "percentage",
    expired: true,
    offerUrl: "https://cdon.se",
    expirationDate: "31/3/2024",
    moreInfo:
      "Påskens specialerbjudande på hem- och trädgårdsprodukter har gått ut. Kampanjen var perfekt för vårstädning och trädgårdsarbete.",
  },
  {
    id: "cdon-exp-006",
    title: "Nyårsrea - 50% rabatt på sport och fritid",
    description: "Starta året aktivt med rabatt på träningsutrustning",
    discount: "50%",
    uses: 445,
    type: "percentage",
    expired: true,
    offerUrl: "https://cdon.se",
    expirationDate: "15/1/2024",
    moreInfo:
      "Nyårets sportkampanj med 50% rabatt på träningsutrustning och fritidsartiklar har avslutats. Perfekt för nyårslöften om mer träning.",
  },
  {
    id: "cdon-exp-007",
    title: "Midsommarrea - Fri leverans på stora produkter",
    description: "Midsommarkampanj med gratis leverans på möbler",
    discount: "GRATIS",
    uses: 678,
    type: "free",
    expired: true,
    offerUrl: "https://cdon.se",
    expirationDate: "30/6/2024",
    moreInfo:
      "Midsommarkampanjen med fri leverans på stora produkter som möbler har gått ut. Detta var ett populärt erbjudande inför sommarsemestern.",
  },
  {
    id: "cdon-exp-008",
    title: "Skolstart - 25% rabatt på elektronik för studenter",
    description: "Studentkampanj inför skolstarten",
    discount: "25%",
    uses: 567,
    type: "percentage",
    expired: true,
    offerUrl: "https://cdon.se",
    expirationDate: "31/8/2024",
    moreInfo:
      "Skolstartskampanjen med 25% rabatt på elektronik för studenter har avslutats. Kampanjen hjälpte många studenter att förbereda sig inför terminen.",
  },
]

export default function CDONPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [showPuzzleModal, setShowPuzzleModal] = useState(false)

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCouponSelect = (coupon: Coupon) => {
    // Update URL when modal opens
    const newUrl = `/cdon/offer/${coupon.id}#td-offer${coupon.id}`
    window.history.pushState({ offerId: coupon.id }, "", newUrl)
    setSelectedCoupon(coupon)
  }

  const handleModalClose = () => {
    // Reset URL when modal closes
    window.history.pushState({}, "", "/cdon")
    setSelectedCoupon(null)
  }

  const getDiscountDisplay = (discount: string, type: string) => {
    if (type === "super") return "SUPER Rabatt"
    if (type === "free") return "GRATIS Rabatt"
    return `${discount} Rabatt`
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="hidden md:block">
          <Breadcrumb storeName="CDON" />
        </div>
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 mt-4 md:mt-6">
          <div className="flex-1 min-w-0">
            <CDONHeroSection />

            {/* Special Promotion */}
            <div className="mt-6 md:mt-8 bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 rounded-lg p-4 md:p-6 border-2 border-orange-200 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-lg sm:text-xl w-fit">
                    60%
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      Specialerbjudande – Upp till 60% rabatt på elektronik
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      Spara stort på TV-apparater, ljudsystem och elektronik hos CDON
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Ingen kod behövs – rabatten tillämpas automatiskt
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const specialCoupon = {
                      id: "cdon-special-electronics",
                      title: "Elektronik - Upp till 60% rabatt",
                      description: "Spara stort på TV-apparater, ljudsystem och elektronik hos CDON",
                      discount: "60%",
                      uses: 789,
                      type: "percentage" as const,
                      offerUrl: "https://cdon.se",
                    }
                    handleCouponSelect(specialCoupon)
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 w-full sm:w-auto text-center"
                >
                  Använd rabatt
                </button>
              </div>
            </div>

            {/* Top Promo Codes Section */}
            <section className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Topp CDON rabattkoder för{" "}
                {new Date().toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="text-xs md:text-sm text-gray-500 mb-4">När du gör ett köp kan vi tjäna en provision.</div>
              <div className="space-y-3 md:space-y-4">
                {topPromoCoupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} onUseDiscount={() => handleCouponSelect(coupon)} />
                ))}
              </div>
            </section>

            {/* Email Subscription */}
            <EmailSubscription />

            {/* Current Coupon Codes Table */}
            <section className="mt-8 md:mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Aktuella CDON rabattkoder för augusti
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                          Rabatt
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                          Beskrivning
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 hidden sm:table-cell">
                          Utgångsdatum
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
                                  ? "text-blue-600"
                                  : coupon.type === "free"
                                    ? "text-green-600"
                                    : "text-blue-600"
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
                              <p className="text-xs text-gray-500 mt-1 sm:hidden">{coupon.expirationDate}</p>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                            <span className="text-gray-900 text-sm md:text-base">{coupon.expirationDate}</span>
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
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Utgångna rabattkoder</h2>
              <div className="space-y-3 md:space-y-4">
                {expiredCoupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} onUseDiscount={() => handleCouponSelect(coupon)} />
                ))}
              </div>
            </section>

            {/* More Information */}
            <CDONMoreInformation />

            {/* Selected Products Section */}
            <CDONSelectedProducts />

            {/* FAQ Section */}
            <CDONFAQ />
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0">
            <CDONSidebar />
          </div>
        </div>
      </main>
      <Footer />
      {selectedCoupon && <CouponModal coupon={selectedCoupon} onClose={handleModalClose} storeName="CDON" />}
      <SliderPuzzleModal isOpen={showPuzzleModal} onClose={() => setShowPuzzleModal(false)} />
    </div>
  )
}
