"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import CouponCard from "../components/CouponCard"
import Footer from "../components/Footer"
import CouponModal from "../components/CouponModal"

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

const powerCoupons: Coupon[] = [
  {
    id: "power-001",
    title: "Upp till 50% rabatt på utvalda produkter",
    description: "Spara stort på elektronik, vitvaror och teknikprodukter hos Power",
    discount: "50%",
    uses: 1247,
    type: "percentage",
    offerUrl: "https://www.power.se",
    expirationDate: "30/9/2025",
    moreInfo:
      "Gäller utvalda produkter inom elektronik, vitvaror och teknik. Begränsat antal produkter och begränsad tid.",
  },
  {
    id: "power-002",
    title: "Fri frakt på alla beställningar över 499 kr",
    description: "Få gratis frakt när du handlar för minst 499 kr hos Power",
    discount: "GRATIS",
    uses: 2156,
    type: "free",
    offerUrl: "https://www.power.se",
    expirationDate: "31/12/2025",
    moreInfo: "Fri standardfrakt på alla produkter vid köp över 499 kr. Gäller även stora vitvaror och elektronik.",
  },
  {
    id: "power-003",
    title: "20% extra rabatt på redan nedsatta varor",
    description: "Kombinera rabatter för maximal besparing på reavaror",
    discount: "20%",
    uses: 892,
    type: "percentage",
    offerUrl: "https://www.power.se",
    expirationDate: "15/9/2025",
    moreInfo:
      "Få 20% extra rabatt på redan nedsatta produkter. Kombinera denna rabatt med befintliga erbjudanden för maximala besparingar.",
  },
  {
    id: "power-004",
    title: "2000 kr rabatt på TV-apparater över 15000 kr",
    description: "Spara stort på premium TV-apparater från Samsung, LG och Sony",
    discount: "2000 kr",
    uses: 345,
    type: "amount",
    offerUrl: "https://www.power.se",
    expirationDate: "30/10/2025",
    moreInfo:
      "Gäller TV-apparater över 15000 kr från Samsung QLED, LG OLED och Sony Bravia. Alla storlekar från 55 tum och uppåt.",
  },
  {
    id: "power-005",
    title: "30% rabatt på hörlurar och ljudprodukter",
    description: "Spara på Sony, Bose, JBL och andra populära ljudmärken",
    discount: "30%",
    uses: 567,
    type: "percentage",
    offerUrl: "https://www.power.se",
    expirationDate: "25/9/2025",
    moreInfo:
      "Gäller hörlurar, högtalare och soundbars från premiumvarumärken. Både trådlösa och kabelanslutna modeller.",
  },
  {
    id: "power-006",
    title: "1500 kr rabatt på smartphones över 8000 kr",
    description: "Exklusiv rabatt på iPhone och Samsung Galaxy telefoner",
    discount: "1500 kr",
    uses: 234,
    type: "amount",
    offerUrl: "https://www.power.se",
    expirationDate: "31/10/2025",
    moreInfo:
      "Gäller smartphones över 8000 kr från Apple iPhone och Samsung Galaxy serien. Alla färger och lagringskapaciteter.",
  },
  {
    id: "power-007",
    title: "25% rabatt på vitvaror och hushållsapparater",
    description: "Spara på kylskåp, tvättmaskiner och andra vitvaror",
    discount: "25%",
    uses: 678,
    type: "percentage",
    offerUrl: "https://www.power.se",
    expirationDate: "15/10/2025",
    moreInfo:
      "Gäller vitvaror från Bosch, Siemens, Electrolux och andra kvalitetsmärken. Både stora och små hushållsapparater.",
  },
  {
    id: "power-008",
    title: "Superrea - Upp till 60% på utvalda elektronik",
    description: "Begränsad superrea med massiva rabatter på elektronik",
    discount: "SUPER",
    uses: 123,
    type: "super",
    offerUrl: "https://www.power.se",
    expirationDate: "10/9/2025",
    moreInfo: "Superrea med upp till 60% rabatt på utvalda elektronikprodukter. Begränsat antal och begränsad tid.",
  },
  {
    id: "power-009",
    title: "15% studentrabatt",
    description: "Exklusiv rabatt för verifierade studenter",
    discount: "15%",
    uses: 445,
    type: "percentage",
    offerUrl: "https://www.power.se",
    expirationDate: "31/12/2025",
    moreInfo: "Studentrabatt för verifierade studenter. Gäller på hela sortimentet förutom redan nedsatta varor.",
  },
  {
    id: "power-010",
    title: "1800 kr rabatt på gaming-laptops",
    description: "Spara på gaming-laptops från ASUS, MSI och HP",
    discount: "1800 kr",
    uses: 189,
    type: "amount",
    offerUrl: "https://www.power.se",
    expirationDate: "30/11/2025",
    moreInfo: "Gäller gaming-laptops över 15000 kr med RTX 4060 eller bättre grafikkort.",
  },
  {
    id: "power-011",
    title: "Fri installation på vitvaror över 10000 kr",
    description: "Få gratis installation och anslutning av dina nya vitvaror",
    discount: "GRATIS",
    uses: 267,
    type: "free",
    offerUrl: "https://www.power.se",
    expirationDate: "31/12/2025",
    moreInfo:
      "Fri installation och anslutning av vitvaror över 10000 kr. Gäller kylskåp, tvättmaskiner, diskmaskiner och andra stora hushållsapparater.",
  },
  {
    id: "power-012",
    title: "10% rabatt för nya kunder",
    description: "Välkomstrabatt för förstagångskunder hos Power",
    discount: "10%",
    uses: 789,
    type: "percentage",
    offerUrl: "https://www.power.se",
    expirationDate: "31/12/2025",
    moreInfo: "10% välkomstrabatt för nya kunder på första köpet. Registrera dig som ny kund för att få rabatten.",
  },
]

const expiredCoupons: Coupon[] = [
  {
    id: "power-exp-001",
    title: "Black Friday - 70% rabatt på elektronik",
    description: "Historisk Black Friday-rabatt på utvalda produkter",
    discount: "70%",
    uses: 3456,
    type: "percentage",
    expired: true,
    offerUrl: "https://www.power.se",
    expirationDate: "27/11/2024",
    moreInfo: "Black Friday-kampanjen med upp till 70% rabatt har avslutats. Håll utkik efter liknande erbjudanden.",
  },
  {
    id: "power-exp-002",
    title: "Cyber Monday - 3000 kr rabatt på datorer",
    description: "Cyber Monday-erbjudande på laptops och stationära datorer",
    discount: "3000 kr",
    uses: 789,
    type: "amount",
    expired: true,
    offerUrl: "https://www.power.se",
    expirationDate: "28/11/2024",
    moreInfo: "Cyber Monday-rabatten på datorer har gått ut. Kampanjen erbjöd 3000 kr rabatt på datorer över 12000 kr.",
  },
]

export default function PowerPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "already_subscribed">("idle")
  const [subscribedEmails, setSubscribedEmails] = useState<Set<string>>(new Set())

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCouponSelect = (coupon: Coupon) => {
    const newUrl = `/power/offer/${coupon.id}#td-offer${coupon.id}`
    window.history.pushState({ offerId: coupon.id }, "", newUrl)
    setSelectedCoupon(coupon)
  }

  const handleModalClose = () => {
    window.history.pushState({}, "", "/power")
    setSelectedCoupon(null)
  }

  const getDiscountDisplay = (discount: string, type: string) => {
    if (type === "super") return "SUPER Rabatt"
    if (type === "free") return "GRATIS Rabatt"
    return `${discount} Rabatt`
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    const normalizedEmail = email.toLowerCase().trim()

    if (subscribedEmails.has(normalizedEmail)) {
      setSubscriptionStatus("already_subscribed")
    } else {
      setSubscribedEmails((prev) => new Set([...prev, normalizedEmail]))
      setSubscriptionStatus("success")
      setEmail("")
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setSubscriptionStatus("idle")
    }, 3000)
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
            <span className="text-gray-900 font-bold">Power</span>
          </nav>
        </div>
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 mt-4 md:mt-6">
          <div className="flex-1 min-w-0">
            {/* Hero Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              <div className="w-20 h-12 sm:w-24 sm:h-16 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200 p-2 flex-shrink-0">
                <img
                  src="https://media.power-cdn.net/images/logos/powerse/logo.svg"
                  alt="Power Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Power Rabattkoder</h1>
                <p className="text-blue-600 text-base sm:text-lg mt-1">
                  Spara stort på elektronik och vitvaror – uppdaterad dagligen
                </p>
              </div>
            </div>

            {/* Top Promo Codes Section */}
            <section className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Topp Power rabattkoder för{" "}
                {new Date().toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="text-xs md:text-sm text-gray-500 mb-4">När du gör ett köp kan vi tjäna en provision.</div>
              <div className="space-y-3 md:space-y-4">
                {powerCoupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} onUseDiscount={() => handleCouponSelect(coupon)} />
                ))}
              </div>
            </section>

            {/* Email Subscription */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mt-6 md:mt-8">
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  Få de senaste Power rabattkoderna direkt i din inkorg
                </h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  Prenumerera på vårt nyhetsbrev och missa aldrig ett erbjudande
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Din e-postadress"
                    className="flex-1 px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:py-2 rounded-lg font-semibold transition-colors text-base md:text-sm"
                  >
                    Prenumerera
                  </button>
                </form>

                {/* Subscription status messages */}
                {subscriptionStatus === "success" && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">
                      Tack för din prenumeration! Du kommer nu att få de senaste rabattkoderna.
                    </p>
                  </div>
                )}

                {subscriptionStatus === "already_subscribed" && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-800 text-sm font-medium">
                      Denna e-postadress är redan prenumererad på vårt nyhetsbrev.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Coupon Codes Table */}
            <section className="mt-8 md:mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Aktuella Power rabattkoder för augusti
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
                      {powerCoupons.map((coupon) => (
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
            <section className="mt-12 prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mer information om Power Sverige</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Om Power</h3>
                  <p className="text-gray-700">
                    Power är en ledande nordisk återförsäljare av elektronik och vitvaror med över 200 butiker i Norge,
                    Sverige, Danmark och Finland. Power erbjuder ett brett sortiment av TV-apparater, datorer,
                    smartphones, hushållsapparater och mycket mer till konkurrenskraftiga priser.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Varför handla hos Power?</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Låga priser och regelbundna kampanjer</li>
                    <li>Stort sortiment från kända märken</li>
                    <li>Snabb leverans och flexibla leveransalternativ</li>
                    <li>Professionell kundservice och support</li>
                    <li>Möjlighet att hämta i butik</li>
                    <li>Prisgaranti och bra villkor</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Populära kategorier</h3>
                  <p className="text-gray-700">
                    TV & Ljud, Datorer & Surfplattor, Mobiltelefoner, Vitvaror, Gaming, Smart Home, Kameror & Foto, samt
                    Tillbehör och reservdelar.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kupongöversikt</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bästa rabatt:</span>
                    <span className="font-semibold text-green-600">50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Högsta besparing:</span>
                    <span className="font-semibold text-green-600">2000 kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rabattkoder:</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Totala erbjudanden:</span>
                    <span className="font-semibold">14</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Power Gaming</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Power har ett brett utbud för gamers med allt från gaming-datorer och konsoler till headsets och
                  gaming-stolar. Hitta de senaste produkterna från PlayStation, Xbox, Nintendo och PC-gaming till
                  konkurrenskraftiga priser.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Power Vitvaror</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Power erbjuder ett stort sortiment av vitvaror från ledande märken som Bosch, Siemens, Electrolux och
                  Whirlpool. Från kylskåp och tvättmaskiner till mikrovågsugnar och kaffemaskiner - allt för ditt hem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {selectedCoupon && <CouponModal coupon={selectedCoupon} onClose={handleModalClose} storeName="Power" />}
    </div>
  )
}
