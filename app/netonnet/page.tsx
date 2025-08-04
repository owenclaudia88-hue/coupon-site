"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import CouponCard from "../components/CouponCard"
import Footer from "../components/Footer"
import CouponModal from "../components/CouponModal"
import EmailSubscription from "../components/EmailSubscription"
import NetOnNetHeroSection from "../components/NetOnNetHeroSection"
import NetOnNetMoreInformation from "../components/NetOnNetMoreInformation"
import NetOnNetFAQ from "../components/NetOnNetFAQ"
import NetOnNetSelectedProducts from "../components/NetOnNetSelectedProducts"
import NetOnNetSidebar from "../components/NetOnNetSidebar"
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
    id: "macbook-air-special",
    title: "Specialerbjudande – Upp till 50% rabatt på MacBook Air M2",
    description: "Spara stort på den senaste MacBook Air M2 hos NetOnNet",
    discount: "50%",
    uses: 892,
    type: "percentage",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "15/9/2025",
    moreInfo:
      "Begränsat erbjudande på MacBook Air M2. Få upp till 50% rabatt på Apples senaste laptop med M2-chip. Perfekt för studier, arbete och kreativt skapande. Ingen kod behövs - rabatten tillämpas automatiskt vid köp.",
  },
  {
    id: "non-001",
    title: "Spara upp till 40% på datorer och laptops",
    description: "Få massiva besparingar på bärbara och stationära datorer",
    discount: "40%",
    uses: 567,
    type: "percentage",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "30/9/2025",
    moreInfo:
      "Denna rabatt gäller på hela datorutbudet hos NetOnNet. Perfekt tillfälle att köpa den dator du längtat efter till ett fantastiskt pris. Rabatten gäller på gaming-datorer, kontorsdatorer, laptops och workstations.",
  },
  {
    id: "non-002",
    title: "Superrea - Upp till 55% rabatt på utvalda produkter",
    description: "Massiva besparingar på utvalda elektronikprodukter",
    discount: "SUPER",
    uses: 234,
    type: "super",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "12/9/2025",
    moreInfo:
      "Superrea hos NetOnNet med upp till 55% rabatt på utvalda produkter. Begränsat antal produkter och begränsad tid. Passa på att fynda elektronik, datorer och teknikprodukter till oslagbara priser.",
  },
  {
    id: "non-003",
    title: "Studentrabatt - 15% rabatt på hela sortimentet",
    description: "15% rabatt för verifierade studenter på alla köp",
    discount: "15%",
    uses: 445,
    type: "percentage",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "31/12/2025",
    moreInfo:
      "Studentrabatt hos NetOnNet! Som student får du 15% rabatt på hela sortimentet. Verifiera din studentstatus och börja spara pengar på all elektronik och teknik du behöver för studierna.",
  },
  {
    id: "non-004",
    title: "Fri frakt på beställningar över 399 kr",
    description: "Få gratis standardfrakt på alla beställningar över 399 kr",
    discount: "GRATIS",
    uses: 1234,
    type: "free",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "31/12/2025",
    moreInfo:
      "Fri frakt på alla beställningar över 399 kr hos NetOnNet. Handla för minst 399 kr så slipper du fraktkostnaden. Gäller på alla produkter och levereras direkt hem till dig eller till utlämningsställe.",
  },
  {
    id: "non-005",
    title: "2500 kr rabatt på Samsung TV över 15000 kr",
    description: "Spara stort på premium Samsung QLED och Neo QLED TV-apparater",
    discount: "2500 kr",
    uses: 123,
    type: "amount",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "31/10/2025",
    moreInfo:
      "Få 2500 kr rabatt på Samsung TV-apparater över 15000 kr. Gäller alla Samsung QLED och Neo QLED modeller inklusive 4K och 8K TV-apparater. Perfekt tillfälle att uppgradera till en större och bättre TV.",
  },
  {
    id: "non-006",
    title: "30% rabatt på gaming-tillbehör",
    description: "Spara på headsets, tangentbord, möss och gaming-stolar",
    discount: "30%",
    uses: 345,
    type: "percentage",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "25/9/2025",
    moreInfo:
      "30% rabatt på alla gaming-tillbehör. Gäller produkter från Razer, Logitech, SteelSeries, Corsair och andra populära gaming-märken. Uppgradera din gaming-setup till ett bättre pris.",
  },
  {
    id: "non-007",
    title: "1800 kr rabatt på iPhone 15 Pro",
    description: "Exklusiv rabatt på iPhone 15 Pro och Pro Max",
    discount: "1800 kr",
    uses: 189,
    type: "amount",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "15/10/2025",
    moreInfo:
      "Spara 1800 kr på iPhone 15 Pro och iPhone 15 Pro Max från Apple. Gäller alla färger och lagringskapaciteter. Perfekt för dig som vill ha den senaste iPhone-tekniken för mindre pengar.",
  },
  {
    id: "non-008",
    title: "25% rabatt på hörlurar och ljudprodukter",
    description: "Spara på Sony, Bose, JBL och andra populära ljudmärken",
    discount: "25%",
    uses: 456,
    type: "percentage",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "20/9/2025",
    moreInfo:
      "25% rabatt på alla hörlurar och ljudprodukter. Gäller produkter från Sony, Bose, JBL, Sennheiser och andra kvalitetsmärken. Både trådlösa och kabelanslutna modeller ingår.",
  },
  {
    id: "non-009",
    title: "20% rabatt på vitvaror",
    description: "Spara på kylskåp, tvättmaskiner och andra vitvaror",
    discount: "20%",
    uses: 278,
    type: "percentage",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "15/10/2025",
    moreInfo:
      "20% rabatt på alla vitvaror. Gäller kylskåp, tvättmaskiner, diskmaskiner, mikrovågsugnar och andra hushållsapparater från Bosch, Siemens, Electrolux och andra kvalitetsmärken.",
  },
  {
    id: "non-010",
    title: "1200 kr rabatt på Samsung Galaxy S24",
    description: "Exklusiv rabatt på Samsung Galaxy S24 serien",
    discount: "1200 kr",
    uses: 167,
    type: "amount",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "30/11/2025",
    moreInfo:
      "1200 kr rabatt på Samsung Galaxy S24, S24+ och S24 Ultra. Gäller alla färger och lagringskapaciteter. Uppgradera till Samsungs senaste flaggskepp med AI-funktioner och fantastisk kamera.",
  },
  {
    id: "non-011",
    title: "Fri installation på vitvaror över 8000 kr",
    description: "Få gratis installation och anslutning av dina nya vitvaror",
    discount: "GRATIS",
    uses: 89,
    type: "free",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "31/12/2025",
    moreInfo:
      "Fri installation på vitvaror över 8000 kr. Vi installerar och ansluter dina nya vitvaror utan extra kostnad. Gäller kylskåp, tvättmaskiner, diskmaskiner och andra stora hushållsapparater.",
  },
  {
    id: "non-012",
    title: "10% rabatt för nya kunder",
    description: "Välkomstrabatt för förstagångskunder hos NetOnNet",
    discount: "10%",
    uses: 634,
    type: "percentage",
    offerUrl: "https://www.netonnet.se",
    expirationDate: "31/12/2025",
    moreInfo:
      "10% välkomstrabatt för nya kunder. Registrera dig som ny kund och få rabatt på ditt första köp. Gäller på hela sortimentet och kan kombineras med andra erbjudanden.",
  },
]

const expiredCoupons: Coupon[] = [
  {
    id: "non-exp-001",
    title: "Black Friday - 60% rabatt på elektronik",
    description: "Historisk Black Friday-rabatt på utvalda elektronikprodukter",
    discount: "60%",
    uses: 2890,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.netonnet.se",
    expirationDate: "27/11/2024",
    moreInfo:
      "Denna fantastiska Black Friday-rabatt på 60% för elektronik har tyvärr gått ut. Håll utkik efter liknande erbjudanden under kommande kampanjperioder.",
  },
  {
    id: "non-exp-002",
    title: "Cyber Monday - 3000 kr rabatt på gaming-datorer",
    description: "Exklusiv Cyber Monday-rabatt på gaming-riggar",
    discount: "3000 kr",
    uses: 456,
    type: "amount",
    expired: true,
    offerUrl: "https://www.netonnet.se",
    expirationDate: "28/11/2024",
    moreInfo:
      "Cyber Monday-erbjudandet med 3000 kr rabatt på gaming-datorer har avslutats. Detta var ett av årets bästa erbjudanden för gamers som ville uppgradera sin setup.",
  },
  {
    id: "non-exp-003",
    title: "Sommarrea - 45% rabatt på luftkonditionering",
    description: "Sommarkampanj på AC-enheter och fläktar",
    discount: "45%",
    uses: 234,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.netonnet.se",
    expirationDate: "31/7/2024",
    moreInfo:
      "Sommarens hetaste erbjudande på luftkonditionering och fläktar har gått ut. Kampanjen erbjöd 45% rabatt på alla kylprodukter under de varmaste månaderna.",
  },
  {
    id: "non-exp-004",
    title: "Julrea - Fri frakt på allt",
    description: "Julkampanj med fri frakt oavsett belopp",
    discount: "GRATIS",
    uses: 1567,
    type: "free",
    expired: true,
    offerUrl: "https://www.netonnet.se",
    expirationDate: "31/12/2024",
    moreInfo:
      "Julkampanjen med fri frakt på alla beställningar har avslutats. Under kampanjen kunde kunder få fri frakt oavsett orderbelopp.",
  },
  {
    id: "non-exp-005",
    title: "Påskrea - 35% rabatt på TV-apparater",
    description: "Påskkampanj på alla TV-apparater och soundbars",
    discount: "35%",
    uses: 678,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.netonnet.se",
    expirationDate: "31/3/2024",
    moreInfo:
      "Påskens specialerbjudande på TV-apparater har gått ut. Kampanjen erbjöd 35% rabatt på alla TV-apparater från Samsung, LG, Sony och andra märken.",
  },
]

export default function NetOnNetPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [showPuzzleModal, setShowPuzzleModal] = useState(false)

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCouponSelect = (coupon: Coupon) => {
    // Update URL when modal opens
    const newUrl = `/netonnet/offer/${coupon.id}#td-offer${coupon.id}`
    window.history.pushState({ offerId: coupon.id }, "", newUrl)
    setSelectedCoupon(coupon)
  }

  const handleModalClose = () => {
    // Reset URL when modal closes
    window.history.pushState({}, "", "/netonnet")
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
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-green-600">
              Hem
            </a>
            <span className="w-4 h-4">›</span>
            <span className="text-gray-900 font-bold">NetOnNet</span>
          </nav>
        </div>
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 mt-4 md:mt-6">
          <div className="flex-1 min-w-0">
            <NetOnNetHeroSection />

            {/* MacBook Air M2 Special Promotion */}
            <div className="mt-6 md:mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-lg p-4 md:p-6 border-2 border-blue-200 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg sm:text-xl w-fit">
                    50%
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      Specialerbjudande – Upp till 50% rabatt på MacBook Air M2
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      Spara stort på den senaste MacBook Air M2 hos NetOnNet
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Ingen kod behövs – rabatten tillämpas automatiskt
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const macbookCoupon = {
                      id: "macbook-air-special",
                      title: "MacBook Air M2 - Upp till 50% rabatt",
                      description: "Spara stort på den senaste MacBook Air M2 hos NetOnNet",
                      discount: "50%",
                      uses: 892,
                      type: "percentage" as const,
                      offerUrl: "https://www.netonnet.se",
                    }
                    handleCouponSelect(macbookCoupon)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto text-center"
                >
                  Använd rabatt
                </button>
              </div>
            </div>

            {/* Top Promo Codes Section */}
            <section className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Topp NetOnNet rabattkoder för{" "}
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
                Aktuella NetOnNet rabattkoder för augusti
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
            <NetOnNetMoreInformation />

            {/* Selected Products Section */}
            <NetOnNetSelectedProducts />

            {/* FAQ Section */}
            <NetOnNetFAQ />
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0">
            <NetOnNetSidebar />
          </div>
        </div>
      </main>
      <Footer />
      {selectedCoupon && <CouponModal coupon={selectedCoupon} onClose={handleModalClose} storeName="NetOnNet" />}
      <SliderPuzzleModal isOpen={showPuzzleModal} onClose={() => setShowPuzzleModal(false)} />
    </div>
  )
}
