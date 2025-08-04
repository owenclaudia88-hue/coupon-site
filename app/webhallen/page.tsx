"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import CouponCard from "../components/CouponCard"
import Footer from "../components/Footer"
import CouponModal from "../components/CouponModal"
import EmailSubscription from "../components/EmailSubscription"
import WebhallenHeroSection from "../components/WebhallenHeroSection"
import WebhallenMoreInformation from "../components/WebhallenMoreInformation"
import WebhallenFAQ from "../components/WebhallenFAQ"
import WebhallenSelectedProducts from "../components/WebhallenSelectedProducts"
import WebhallenSidebar from "../components/WebhallenSidebar"
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
    id: "gaming-computer-special",
    title: "Specialerbjudande – Upp till 35% rabatt på gaming-datorer",
    description: "Spara stort på de senaste gaming-datorerna hos Webhallen",
    discount: "35%",
    uses: 789,
    type: "percentage",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "15/9/2025",
    moreInfo:
      "Begränsat erbjudande på gaming-datorer. Få upp till 35% rabatt på färdigbyggda gaming-riggar med RTX 4070, RTX 4080 och RTX 4090. Perfekt för gaming och streaming. Ingen kod behövs - rabatten tillämpas automatiskt vid köp.",
  },
  {
    id: "wh-001",
    title: "Spara upp till 30% på gaming-laptops",
    description: "Få massiva besparingar på bärbara gaming-datorer",
    discount: "30%",
    uses: 456,
    type: "percentage",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "30/9/2025",
    moreInfo:
      "30% rabatt på gaming-laptops från ASUS ROG, MSI Gaming, Razer Blade och andra premium gaming-märken. Perfekt för gaming på sprung eller för studenter som behöver kraftfull prestanda.",
  },
  {
    id: "wh-002",
    title: "Superrea - Upp till 50% rabatt på gaming-tillbehör",
    description: "Massiva besparingar på headsets, tangentbord, möss och mer",
    discount: "SUPER",
    uses: 234,
    type: "super",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "12/9/2025",
    moreInfo:
      "Superrea på gaming-tillbehör med upp till 50% rabatt. Gäller produkter från Razer, Logitech G, SteelSeries, HyperX och Corsair. Uppgradera din gaming-setup till oslagbara priser.",
  },
  {
    id: "wh-003",
    title: "Studentrabatt - 15% rabatt på hela sortimentet",
    description: "15% rabatt för verifierade studenter på alla gaming-produkter",
    discount: "15%",
    uses: 567,
    type: "percentage",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "31/12/2025",
    moreInfo:
      "Studentrabatt hos Webhallen! Som student får du 15% rabatt på hela sortimentet. Verifiera din studentstatus och börja spara på gaming-datorer, komponenter och tillbehör.",
  },
  {
    id: "wh-004",
    title: "Fri frakt på beställningar över 500 kr",
    description: "Få gratis standardfrakt på alla gaming-produkter över 500 kr",
    discount: "GRATIS",
    uses: 1123,
    type: "free",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "31/12/2025",
    moreInfo:
      "Fri frakt på alla beställningar över 500 kr hos Webhallen. Handla gaming-produkter för minst 500 kr så slipper du fraktkostnaden. Snabb leverans direkt hem till dig.",
  },
  {
    id: "wh-005",
    title: "2200 kr rabatt på grafikkort över 8000 kr",
    description: "Spara stort på RTX 4070, RTX 4080 och RTX 4090 grafikkort",
    discount: "2200 kr",
    uses: 89,
    type: "amount",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "31/10/2025",
    moreInfo:
      "Få 2200 kr rabatt på grafikkort över 8000 kr. Gäller NVIDIA RTX 4070, RTX 4080, RTX 4090 och AMD RX 7800 XT, RX 7900 XTX. Perfekt för att uppgradera din gaming-rigg.",
  },
  {
    id: "wh-006",
    title: "25% rabatt på VR-headsets",
    description: "Spara på Meta Quest, PICO och andra VR-system",
    discount: "25%",
    uses: 178,
    type: "percentage",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "25/9/2025",
    moreInfo:
      "25% rabatt på alla VR-headsets. Gäller Meta Quest 3, PICO 4, HTC Vive och andra VR-system. Upplev virtual reality till ett fantastiskt pris.",
  },
  {
    id: "wh-007",
    title: "1800 kr rabatt på streaming-utrustning",
    description: "Exklusiv rabatt på streaming-kameror, mikrofoner och ljussättning",
    discount: "1800 kr",
    uses: 123,
    type: "amount",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "15/10/2025",
    moreInfo:
      "Spara 1800 kr på streaming-utrustning. Gäller Elgato Stream Deck, Logitech streamlabs-kameror, Blue Yeti-mikrofoner och professionell ljussättning för streamers.",
  },
  {
    id: "wh-008",
    title: "30% rabatt på gaming-stolar",
    description: "Spara på ergonomiska gaming-stolar från Secretlab och DXRacer",
    discount: "30%",
    uses: 267,
    type: "percentage",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "20/9/2025",
    moreInfo:
      "30% rabatt på gaming-stolar. Gäller Secretlab Titan Evo, DXRacer Formula Series och andra ergonomiska gaming-stolar. Spela bekvämt i timmar.",
  },
  {
    id: "wh-009",
    title: "20% rabatt på gaming-monitorer",
    description: "Spara på 144Hz, 240Hz och 4K gaming-skärmar",
    discount: "20%",
    uses: 345,
    type: "percentage",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "15/10/2025",
    moreInfo:
      "20% rabatt på gaming-monitorer. Gäller ASUS ROG, MSI Gaming, AOC Gaming och andra gaming-skärmar med hög refresh rate och låg input lag.",
  },
  {
    id: "wh-010",
    title: "1500 kr rabatt på spelkonsoler",
    description: "Spara på PlayStation 5, Xbox Series X och Nintendo Switch",
    discount: "1500 kr",
    uses: 234,
    type: "amount",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "30/11/2025",
    moreInfo:
      "1500 kr rabatt på spelkonsoler. Gäller PlayStation 5, Xbox Series X|S, Nintendo Switch OLED och Steam Deck. Börja spela de senaste spelen för mindre pengar.",
  },
  {
    id: "wh-011",
    title: "Fri bygghjälp vid köp av komponenter över 15000 kr",
    description: "Få gratis montering av din nya gaming-dator",
    discount: "GRATIS",
    uses: 67,
    type: "free",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "31/12/2025",
    moreInfo:
      "Fri bygghjälp när du köper komponenter för över 15000 kr. Våra experter bygger din gaming-dator åt dig utan extra kostnad. Inkluderar installation av Windows och grundläggande konfiguration.",
  },
  {
    id: "wh-012",
    title: "10% rabatt för nya kunder",
    description: "Välkomstrabatt för förstagångskunder hos Webhallen",
    discount: "10%",
    uses: 678,
    type: "percentage",
    offerUrl: "https://www.webhallen.com",
    expirationDate: "31/12/2025",
    moreInfo:
      "10% välkomstrabatt för nya kunder. Registrera dig som ny kund och få rabatt på ditt första köp. Gäller på hela gaming-sortimentet och kan kombineras med andra erbjudanden.",
  },
]

const expiredCoupons: Coupon[] = [
  {
    id: "wh-exp-001",
    title: "Black Friday - 60% rabatt på gaming-tillbehör",
    description: "Historisk Black Friday-rabatt på headsets och tangentbord",
    discount: "60%",
    uses: 2340,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.webhallen.com",
    expirationDate: "27/11/2024",
    moreInfo:
      "Denna fantastiska Black Friday-rabatt på 60% för gaming-tillbehör har tyvärr gått ut. Håll utkik efter liknande erbjudanden under kommande kampanjperioder.",
  },
  {
    id: "wh-exp-002",
    title: "Cyber Monday - 4000 kr rabatt på RTX 4090",
    description: "Exklusiv Cyber Monday-rabatt på premium grafikkort",
    discount: "4000 kr",
    uses: 89,
    type: "amount",
    expired: true,
    offerUrl: "https://www.webhallen.com",
    expirationDate: "28/11/2024",
    moreInfo:
      "Cyber Monday-erbjudandet med 4000 kr rabatt på RTX 4090 grafikkort har avslutats. Detta var ett av årets bästa erbjudanden för high-end gaming.",
  },
  {
    id: "wh-exp-003",
    title: "Sommarrea - 40% rabatt på VR-headsets",
    description: "Sommarkampanj på virtual reality-utrustning",
    discount: "40%",
    uses: 156,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.webhallen.com",
    expirationDate: "31/7/2024",
    moreInfo:
      "Sommarens VR-kampanj med 40% rabatt på headsets har gått ut. Kampanjen erbjöd fantastiska priser på Meta Quest och HTC Vive under sommarmånaderna.",
  },
  {
    id: "wh-exp-004",
    title: "Julrea - Fri frakt på allt",
    description: "Julkampanj med fri frakt oavsett belopp",
    discount: "GRATIS",
    uses: 1567,
    type: "free",
    expired: true,
    offerUrl: "https://www.webhallen.com",
    expirationDate: "31/12/2024",
    moreInfo:
      "Julkampanjen med fri frakt på alla gaming-produkter har avslutats. Under kampanjen kunde kunder få fri frakt oavsett orderbelopp.",
  },
  {
    id: "wh-exp-005",
    title: "Påskrea - 35% rabatt på gaming-datorer",
    description: "Påskkampanj på färdigbyggda gaming-riggar",
    discount: "35%",
    uses: 234,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.webhallen.com",
    expirationDate: "31/3/2024",
    moreInfo:
      "Påskens specialerbjudande på gaming-datorer har gått ut. Kampanjen erbjöd 35% rabatt på färdigbyggda gaming-riggar med RTX 4070 och RTX 4080.",
  },
]

export default function WebhallenPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [showPuzzleModal, setShowPuzzleModal] = useState(false)

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCouponSelect = (coupon: Coupon) => {
    // Update URL when modal opens
    const newUrl = `/webhallen/offer/${coupon.id}#td-offer${coupon.id}`
    window.history.pushState({ offerId: coupon.id }, "", newUrl)
    setSelectedCoupon(coupon)
  }

  const handleModalClose = () => {
    // Reset URL when modal closes
    window.history.pushState({}, "", "/webhallen")
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
            <span className="text-gray-900 font-bold">Webhallen</span>
          </nav>
        </div>
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 mt-4 md:mt-6">
          <div className="flex-1 min-w-0">
            <WebhallenHeroSection />

            {/* Gaming Computer Special Promotion */}
            <div className="mt-6 md:mt-8 bg-gradient-to-r from-blue-50 via-orange-50 to-blue-50 rounded-lg p-4 md:p-6 border-2 border-orange-200 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-lg sm:text-xl w-fit">
                    35%
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      Specialerbjudande – Upp till 35% rabatt på gaming-datorer
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      Spara stort på de senaste gaming-datorerna hos Webhallen
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Ingen kod behövs – rabatten tillämpas automatiskt
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const gamingCoupon = {
                      id: "gaming-computer-special",
                      title: "Gaming-datorer - Upp till 35% rabatt",
                      description: "Spara stort på de senaste gaming-datorerna hos Webhallen",
                      discount: "35%",
                      uses: 789,
                      type: "percentage" as const,
                      offerUrl: "https://www.webhallen.com",
                    }
                    handleCouponSelect(gamingCoupon)
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
                Topp Webhallen rabattkoder för{" "}
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
                Aktuella Webhallen rabattkoder för september
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
                                  ? "text-orange-600"
                                  : coupon.type === "free"
                                    ? "text-green-600"
                                    : "text-orange-600"
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
            <WebhallenMoreInformation />

            {/* Selected Products Section */}
            <WebhallenSelectedProducts />

            {/* FAQ Section */}
            <WebhallenFAQ />
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0">
            <WebhallenSidebar />
          </div>
        </div>
      </main>
      <Footer />
      {selectedCoupon && <CouponModal coupon={selectedCoupon} onClose={handleModalClose} storeName="Webhallen" />}
      <SliderPuzzleModal isOpen={showPuzzleModal} onClose={() => setShowPuzzleModal(false)} />
    </div>
  )
}
