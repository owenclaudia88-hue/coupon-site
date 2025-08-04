"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import CouponCard from "../components/CouponCard"
import Footer from "../components/Footer"
import CouponModal from "../components/CouponModal"
import KomplettHeroSection from "../components/KomplettHeroSection"
import KomplettMoreInformation from "../components/KomplettMoreInformation"
import KomplettSelectedProducts from "../components/KomplettSelectedProducts"
import KomplettFAQ from "../components/KomplettFAQ"
import KomplettSidebar from "../components/KomplettSidebar"

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

const komplettCoupons: Coupon[] = [
  {
    id: "komp-001",
    title: "Upp till 45% rabatt på datorer och komponenter",
    description: "Spara stort på processorer, grafikkort och färdigbyggda datorer",
    discount: "45%",
    uses: 456,
    type: "percentage",
    offerUrl: "https://www.komplett.se",
    expirationDate: "30/9/2025",
    moreInfo: "Gäller datorkomponenter och färdigbyggda datorer från Intel, AMD, NVIDIA och andra märken.",
  },
  {
    id: "komp-002",
    title: "2000 kr rabatt på gaming-setup",
    description: "Exklusiv rabatt när du köper dator + skärm + tillbehör",
    discount: "2000 kr",
    uses: 123,
    type: "amount",
    offerUrl: "https://www.komplett.se",
    expirationDate: "15/10/2025",
    moreInfo: "Gäller när du köper gaming-dator, skärm och gaming-tillbehör för minst 25000 kr totalt.",
  },
  {
    id: "komp-003",
    title: "Fri frakt på alla beställningar",
    description: "Få gratis frakt oavsett orderbelopp",
    discount: "GRATIS",
    uses: 1123,
    type: "free",
    offerUrl: "https://www.komplett.se",
    expirationDate: "31/12/2025",
    moreInfo: "Fri standardfrakt på alla produkter, inga minimikrav på orderbelopp.",
  },
  {
    id: "komp-004",
    title: "25% rabatt på gaming-skärmar",
    description: "Spara på gaming-monitorer från ASUS, MSI och Acer",
    discount: "25%",
    uses: 234,
    type: "percentage",
    offerUrl: "https://www.komplett.se",
    expirationDate: "25/9/2025",
    moreInfo: "Gäller gaming-skärmar med 144Hz eller högre uppdateringsfrekvens.",
  },
  {
    id: "komp-005",
    title: "20% rabatt på processorer",
    description: "Spara på Intel Core och AMD Ryzen processorer",
    discount: "20%",
    uses: 167,
    type: "percentage",
    offerUrl: "https://www.komplett.se",
    expirationDate: "31/10/2025",
    moreInfo: "Gäller processorer över 3000 kr från Intel Core i5/i7/i9 och AMD Ryzen 5/7/9 serien.",
  },
  {
    id: "komp-006",
    title: "30% rabatt på nätverk och routrar",
    description: "Spara på WiFi-routrar, switches och nätverksprodukter",
    discount: "30%",
    uses: 345,
    type: "percentage",
    offerUrl: "https://www.komplett.se",
    expirationDate: "20/9/2025",
    moreInfo: "Gäller nätverksprodukter från ASUS, Netgear, TP-Link och andra märken.",
  },
  {
    id: "komp-007",
    title: "35% rabatt på lagring och SSD",
    description: "Spara på SSD-diskar, hårddiskar och extern lagring",
    discount: "35%",
    uses: 567,
    type: "percentage",
    offerUrl: "https://www.komplett.se",
    expirationDate: "15/10/2025",
    moreInfo: "Gäller SSD-diskar, hårddiskar och extern lagring från Samsung, Western Digital och Kingston.",
  },
  {
    id: "komp-008",
    title: "15% studentrabatt",
    description: "Exklusiv rabatt för verifierade studenter",
    discount: "15%",
    uses: 678,
    type: "percentage",
    offerUrl: "https://www.komplett.se",
    expirationDate: "31/12/2025",
    moreInfo: "Studentrabatt för verifierade studenter på hela sortimentet.",
  },
  {
    id: "komp-009",
    title: "40% rabatt på gaming-tillbehör",
    description: "Spara på tangentbord, möss och headsets",
    discount: "40%",
    uses: 289,
    type: "percentage",
    offerUrl: "https://www.komplett.se",
    expirationDate: "30/11/2025",
    moreInfo: "Gäller gaming-tillbehör från Razer, Logitech, SteelSeries och andra märken.",
  },
]

export default function KomplettPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCouponSelect = (coupon: Coupon) => {
    const newUrl = `/komplett/offer/${coupon.id}#td-offer${coupon.id}`
    window.history.pushState({ offerId: coupon.id }, "", newUrl)
    setSelectedCoupon(coupon)
  }

  const handleModalClose = () => {
    window.history.pushState({}, "", "/komplett")
    setSelectedCoupon(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="hidden md:block">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-purple-600">
              Hem
            </a>
            <span className="w-4 h-4">›</span>
            <span className="text-gray-900 font-bold">Komplett</span>
          </nav>
        </div>
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 mt-4 md:mt-6">
          <div className="flex-1 min-w-0">
            {/* Hero Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              <div className="w-20 h-12 sm:w-24 sm:h-16 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200 p-2 flex-shrink-0">
                <img src="/images/komplett-logo.svg" alt="Komplett Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Komplett Rabattkoder</h1>
                <p className="text-purple-600 text-base sm:text-lg mt-1">
                  Spara stort på datorer och teknik – uppdaterad dagligen
                </p>
              </div>
            </div>

            {/* Hero Section Component */}
            <KomplettHeroSection />

            {/* Top Promo Codes Section */}
            <section className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Topp Komplett rabattkoder för{" "}
                {new Date().toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="text-xs md:text-sm text-gray-500 mb-4">När du gör ett köp kan vi tjäna en provision.</div>
              <div className="space-y-3 md:space-y-4">
                {komplettCoupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} onUseDiscount={() => handleCouponSelect(coupon)} />
                ))}
              </div>
            </section>

            {/* Selected Products */}
            <KomplettSelectedProducts />

            {/* More Information */}
            <KomplettMoreInformation />

            {/* FAQ */}
            <KomplettFAQ />
          </div>

          {/* Sidebar */}
          <div className="xl:w-80 flex-shrink-0">
            <div className="sticky top-6">
              <KomplettSidebar />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {selectedCoupon && <CouponModal coupon={selectedCoupon} onClose={handleModalClose} storeName="Komplett" />}
    </div>
  )
}
