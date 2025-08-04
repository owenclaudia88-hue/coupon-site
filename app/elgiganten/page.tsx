"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Breadcrumb from "../components/Breadcrumb"
import HeroSection from "../components/HeroSection"
import CouponCard from "../components/CouponCard"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import CouponModal from "../components/CouponModal"
import EmailSubscription from "../components/EmailSubscription"
import MoreInformation from "../components/MoreInformation"
import FAQ from "../components/FAQ"
import SelectedProducts from "../components/SelectedProducts"
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
    id: "iphone-16-pro-max",
    title: "Specialerbjudande – Upp till 70% rabatt på iPhone 16 Pro Max",
    description: "Spara stort på den senaste iPhone 16 Pro Max hos Elgiganten",
    discount: "70%",
    uses: 1247,
    type: "percentage",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "15/9/2025",
    moreInfo:
      "Begränsat erbjudande på iPhone 16 Pro Max. Få upp till 70% rabatt på den senaste iPhone-modellen med alla nya funktioner. Ingen kod behövs - rabatten tillämpas automatiskt vid köp.",
  },
  {
    id: "elg-001",
    title: "Spara upp till 40% på allt hos Elgiganten",
    description: "Få massiva besparingar på din hela beställning med denna exklusiva rabatt",
    discount: "40%",
    uses: 163,
    type: "percentage",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/8/2025",
    moreInfo:
      "Denna rabatt gäller på hela sortimentet hos Elgiganten. Perfekt tillfälle att köpa den elektronik du längtat efter till ett fantastiskt pris. Rabatten gäller på TV-apparater, datorer, hushållsapparater och mycket mer.",
  },
  {
    id: "elg-002",
    title: "Superrea - Upp till 60% rabatt på utvalda varor",
    description: "Massiva besparingar på utvalda varor under vår superrea-händelse",
    discount: "SUPER",
    uses: 89,
    type: "super",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "15/9/2025",
    moreInfo:
      "Superrea hos Elgiganten med upp till 60% rabatt på utvalda produkter. Begränsat antal produkter och begränsad tid. Passa på att fynda elektronik, vitvaror och teknikprodukter till oslagbara priser.",
  },
  {
    id: "elg-003",
    title: "Studentrabatt - 20% rabatt på allt",
    description: "20% rabatt för verifierade studenter på alla köp",
    discount: "20%",
    uses: 234,
    type: "percentage",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/12/2025",
    moreInfo:
      "Studentrabatt hos Elgiganten! Som student får du 20% rabatt på hela sortimentet. Verifiera din studentstatus och börja spara pengar på all elektronik och teknik du behöver för studierna.",
  },
  {
    id: "elg-004",
    title: "Fri frakt på beställningar över 500 kr",
    description: "Få gratis standardfrakt på alla beställningar över 500 kr",
    discount: "GRATIS",
    uses: 1247,
    type: "free",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/12/2025",
    moreInfo:
      "Fri frakt på alla beställningar över 500 kr hos Elgiganten. Handla för minst 500 kr så slipper du fraktkostnaden. Gäller på alla produkter och levereras direkt hem till dig.",
  },
  {
    id: "elg-005",
    title: "3000 kr rabatt på TV-apparater över 15000 kr",
    description: "Spara stort på premium TV-apparater från Samsung, LG och Sony",
    discount: "3000 kr",
    uses: 78,
    type: "amount",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "30/9/2025",
    moreInfo:
      "Få 3000 kr rabatt på TV-apparater över 15000 kr. Gäller alla märken inklusive Samsung QLED, LG OLED och Sony Bravia. Perfekt tillfälle att uppgradera till en större och bättre TV.",
  },
  {
    id: "elg-006",
    title: "25% rabatt på alla hushållsapparater",
    description: "Spara på vitvaror, köksmaskiner och småapparater",
    discount: "25%",
    uses: 156,
    type: "percentage",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "15/10/2025",
    moreInfo:
      "25% rabatt på alla hushållsapparater. Gäller kylskåp, tvättmaskiner, diskmaskiner, mikrovågsugnar och mycket mer. Uppgradera ditt hem med nya vitvaror till fantastiska priser.",
  },
  {
    id: "elg-007",
    title: "2000 kr rabatt på datorer och laptops",
    description: "Exklusiv rabatt på bärbara och stationära datorer",
    discount: "2000 kr",
    uses: 92,
    type: "amount",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/10/2025",
    moreInfo:
      "Spara 2000 kr på datorer och laptops från alla stora märken som HP, Dell, Lenovo och ASUS. Perfekt för studier, arbete eller gaming. Gäller både Windows och Mac-datorer.",
  },
  {
    id: "elg-008",
    title: "30% rabatt på gaming-tillbehör",
    description: "Spara på headsets, tangentbord, möss och gaming-stolar",
    discount: "30%",
    uses: 203,
    type: "percentage",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "20/9/2025",
    moreInfo:
      "30% rabatt på alla gaming-tillbehör. Gäller produkter från Razer, Logitech, SteelSeries och andra populära gaming-märken. Uppgradera din gaming-setup till ett bättre pris.",
  },
  {
    id: "elg-009",
    title: "15% extra rabatt på redan nedsatta varor",
    description: "Kombinera rabatter för maximal besparing på reavaror",
    discount: "15%",
    uses: 445,
    type: "percentage",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/8/2025",
    moreInfo:
      "Få 15% extra rabatt på redan nedsatta varor. Kombinera denna rabatt med befintliga erbjudanden för att maximera dina besparingar på elektronik och teknik.",
  },
  {
    id: "elg-010",
    title: "1500 kr rabatt på smartphones över 8000 kr",
    description: "Spara på de senaste iPhone och Samsung Galaxy-modellerna",
    discount: "1500 kr",
    uses: 67,
    type: "amount",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "30/11/2025",
    moreInfo:
      "1500 kr rabatt på smartphones över 8000 kr. Gäller iPhone 15, Samsung Galaxy S24, Google Pixel och andra premium-telefoner. Uppgradera till senaste tekniken för mindre pengar.",
  },
  {
    id: "elg-011",
    title: "Fri installation på vitvaror över 10000 kr",
    description: "Få gratis installation och anslutning av dina nya vitvaror",
    discount: "GRATIS",
    uses: 134,
    type: "free",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/12/2025",
    moreInfo:
      "Fri installation på vitvaror över 10000 kr. Vi installerar och ansluter dina nya vitvaror utan extra kostnad. Gäller kylskåp, tvättmaskiner, diskmaskiner och andra stora hushållsapparater.",
  },
  {
    id: "elg-012",
    title: "10% rabatt för nya kunder",
    description: "Välkomstrabatt för förstagångskunder hos Elgiganten",
    discount: "10%",
    uses: 892,
    type: "percentage",
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/12/2025",
    moreInfo:
      "10% välkomstrabatt för nya kunder. Registrera dig som ny kund och få rabatt på ditt första köp. Gäller på hela sortimentet och kan kombineras med andra erbjudanden.",
  },
]

const expiredCoupons: Coupon[] = [
  {
    id: "elg-exp-001",
    title: "Black Friday - 50% rabatt på TV-apparater",
    description: "Historisk Black Friday-rabatt på alla TV-apparater",
    discount: "50%",
    uses: 2156,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "30/11/2024",
    moreInfo:
      "Denna fantastiska Black Friday-rabatt på 50% för TV-apparater har tyvärr gått ut. Håll utkik efter liknande erbjudanden under kommande kampanjperioder.",
  },
  {
    id: "elg-exp-002",
    title: "Julrea - Fri frakt på allt",
    description: "Julkampanj med fri frakt oavsett belopp",
    discount: "GRATIS",
    uses: 3421,
    type: "free",
    expired: true,
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/12/2024",
    moreInfo:
      "Julkampanjen med fri frakt på alla beställningar har avslutats. Under kampanjen kunde kunder få fri frakt oavsett orderbelopp.",
  },
  {
    id: "elg-exp-003",
    title: "Sommarrea - 35% rabatt på luftkonditionering",
    description: "Sommarkampanj på AC-enheter och fläktar",
    discount: "35%",
    uses: 567,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/7/2024",
    moreInfo:
      "Sommarens hetaste erbjudande på luftkonditionering och fläktar har gått ut. Kampanjen erbjöd 35% rabatt på alla kylprodukter under de varmaste månaderna.",
  },
  {
    id: "elg-exp-004",
    title: "Cyber Monday - 4000 kr rabatt på gaming-datorer",
    description: "Exklusiv Cyber Monday-rabatt på gaming-riggar",
    discount: "4000 kr",
    uses: 234,
    type: "amount",
    expired: true,
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "27/11/2024",
    moreInfo:
      "Cyber Monday-erbjudandet med 4000 kr rabatt på gaming-datorer har avslutats. Detta var ett av årets bästa erbjudanden för gamers som ville uppgradera sin setup.",
  },
  {
    id: "elg-exp-005",
    title: "Påskrea - 20% rabatt på köksmaskiner",
    description: "Påskkampanj på alla kökstillbehör och maskiner",
    discount: "20%",
    uses: 789,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "31/3/2024",
    moreInfo:
      "Påskens specialerbjudande på köksmaskiner har gått ut. Kampanjen erbjöd 20% rabatt på allt från kaffemaskiner till köksassistenter och blenders.",
  },
  {
    id: "elg-exp-006",
    title: "Nyårsrea - 45% rabatt på ljudsystem",
    description: "Starta året med bättre ljud - rabatt på högtalare och soundbars",
    discount: "45%",
    uses: 445,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "15/1/2024",
    moreInfo:
      "Nyårets ljudkampanj med 45% rabatt på högtalare, soundbars och stereosystem har avslutats. Detta var ett populärt erbjudande för att förbättra hemmaunderhållningen.",
  },
  {
    id: "elg-exp-007",
    title: "Midsommarrea - Fri leverans på stora vitvaror",
    description: "Midsommarkampanj med gratis leverans på kyl och frys",
    discount: "GRATIS",
    uses: 678,
    type: "free",
    expired: true,
    offerUrl: "https://www.elgiganten.se",
    expirationDate: "30/6/2024",
    moreInfo:
      "Midsommarkampanjen med fri leverans på stora vitvaror som kylskåp och frysar har gått ut. Detta var ett populärt erbjudande inför sommarsemestern.",
  },
]

export default function Home() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [showPuzzleModal, setShowPuzzleModal] = useState(false)

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCouponSelect = (coupon: Coupon) => {
    // Update URL when modal opens
    const newUrl = `/elgiganten/offer/${coupon.id}#td-offer${coupon.id}`
    window.history.pushState({ offerId: coupon.id }, "", newUrl)
    setSelectedCoupon(coupon)
  }

  const handleModalClose = () => {
    // Reset URL when modal closes
    window.history.pushState({}, "", "/elgiganten")
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
          <Breadcrumb />
        </div>
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 mt-4 md:mt-6">
          <div className="flex-1 min-w-0">
            <HeroSection />

            {/* iPhone 16 Pro Max Special Promotion */}
            <div className="mt-6 md:mt-8 bg-gradient-to-r from-green-50 via-blue-50 to-green-50 rounded-lg p-4 md:p-6 border-2 border-green-200 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg sm:text-xl w-fit">
                    70%
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      Specialerbjudande – Upp till 70% rabatt på iPhone 16 Pro Max
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      Spara stort på den senaste iPhone 16 Pro Max hos Elgiganten
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Ingen kod behövs – rabatten tillämpas automatiskt
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const iphoneCoupon = {
                      id: "iphone-16-pro-max",
                      title: "iPhone 16 Pro Max - Upp till 70% rabatt",
                      description: "Spara stort på den senaste iPhone 16 Pro Max hos Elgiganten",
                      discount: "70%",
                      uses: 1247,
                      type: "percentage" as const,
                      offerUrl: "https://www.elgiganten.se",
                    }
                    handleCouponSelect(iphoneCoupon)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full sm:w-auto text-center"
                >
                  Använd rabatt
                </button>
              </div>
            </div>

            {/* Top Promo Codes Section */}
            <section className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Topp Elgiganten rabattkoder för{" "}
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
                Aktuella Elgiganten rabattkoder för augusti
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
            <MoreInformation />

            {/* Selected Products Section */}
            <SelectedProducts />

            {/* FAQ Section */}
            <FAQ />
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0">
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
      {selectedCoupon && <CouponModal coupon={selectedCoupon} onClose={handleModalClose} storeName="Elgiganten" />}
      <SliderPuzzleModal isOpen={showPuzzleModal} onClose={() => setShowPuzzleModal(false)} />
    </div>
  )
}
