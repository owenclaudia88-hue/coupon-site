
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import CouponCard from "../components/CouponCard";
import Footer from "../components/Footer";
import CouponModal from "../components/CouponModal";
import OfferPopup from "../components/OfferPopup";

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

const powerCoupons: Coupon[] = [
  {
    id: "power-001",
    title: "Upp till 50% rabatt på utvalda produkter",
    description: "Spara stort på elektronik, vitvaror och teknikprodukter hos Power",
    discount: "50%",
    uses: 1247,
    type: "percentage",
    offerUrl: "/power/verify?id=power-001",
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
    offerUrl: "/power/verify?id=power-002",
    expirationDate: "31/12/2025",
    moreInfo:
      "Fri standardfrakt på alla produkter vid köp över 499 kr. Gäller även stora vitvaror och elektronik.",
  },
  {
    id: "power-003",
    title: "20% extra rabatt på redan nedsatta varor",
    description: "Kombinera rabatter för maximal besparing på reavaror",
    discount: "20%",
    uses: 892,
    type: "percentage",
    offerUrl: "/power/verify?id=power-003",
    expirationDate: "15/9/2025",
    moreInfo:
      "Få 20% extra rabatt på redan nedsatta produkter. Kombinera denna rabatt med befintliga erbjudanden för maximala besparingar.",
  },
  {
    id: "power-004",
    title: "2000 kr rabatt på TV-apparater över 15000 kr",
    description:
      "Spara stort på premium TV-apparater från Samsung, LG och Sony",
    discount: "2000 kr",
    uses: 345,
    type: "amount",
    offerUrl: "/power/verify?id=power-004",
    expirationDate: "30/10/2025",
    moreInfo:
      "Gäller TV-apparater över 15000 kr från Samsung QLED, LG OLED och Sony Bravia.",
  },
  {
    id: "power-005",
    title: "30% rabatt på hörlurar och ljudprodukter",
    description: "Spara på Sony, Bose, JBL och andra populära ljudmärken",
    discount: "30%",
    uses: 567,
    type: "percentage",
    offerUrl: "/power/verify?id=power-005",
    expirationDate: "25/9/2025",
    moreInfo:
      "Gäller hörlurar, högtalare och soundbars från premiumvarumärken.",
  },
  {
    id: "power-006",
    title: "1500 kr rabatt på smartphones över 8000 kr",
    description: "Exklusiv rabatt på iPhone och Samsung Galaxy telefoner",
    discount: "1500 kr",
    uses: 234,
    type: "amount",
    offerUrl: "/power/verify?id=power-006",
    expirationDate: "31/10/2025",
    moreInfo:
      "Gäller smartphones över 8000 kr från Apple iPhone och Samsung Galaxy-serien.",
  },
  {
    id: "power-007",
    title: "25% rabatt på vitvaror och hushållsapparater",
    description: "Spara på kylskåp, tvättmaskiner och andra vitvaror",
    discount: "25%",
    uses: 678,
    type: "percentage",
    offerUrl: "/power/verify?id=power-007",
    expirationDate: "15/10/2025",
    moreInfo:
      "Gäller vitvaror från Bosch, Siemens, Electrolux och fler.",
  },
  {
    id: "power-008",
    title: "Superrea - Upp till 60% på utvalda elektronik",
    description: "Begränsad superrea med massiva rabatter",
    discount: "SUPER",
    uses: 123,
    type: "super",
    offerUrl: "/power/verify?id=power-008",
    expirationDate: "10/9/2025",
    moreInfo:
      "Superrea med upp till 60% rabatt på utvalda elektronikprodukter.",
  },
  {
    id: "power-009",
    title: "15% studentrabatt",
    description: "Exklusiv rabatt för verifierade studenter",
    discount: "15%",
    uses: 445,
    type: "percentage",
    offerUrl: "/power/verify?id=power-009",
    expirationDate: "31/12/2025",
    moreInfo:
      "Gäller på stora delar av sortimentet (ej redan nedsatt).",
  },
  {
    id: "power-010",
    title: "1800 kr rabatt på gaming-laptops",
    description: "Spara på gaming-laptops från ASUS, MSI och HP",
    discount: "1800 kr",
    uses: 189,
    type: "amount",
    offerUrl: "/power/verify?id=power-010",
    expirationDate: "30/11/2025",
    moreInfo:
      "Gäller gaming-laptops över 15000 kr med RTX 4060 eller bättre.",
  },
  {
    id: "power-011",
    title: "Fri installation på vitvaror över 10000 kr",
    description: "Gratis installation & anslutning",
    discount: "GRATIS",
    uses: 267,
    type: "free",
    offerUrl: "/power/verify?id=power-011",
    expirationDate: "31/12/2025",
    moreInfo:
      "Gäller kyl, frys, tvätt, diskmaskin m.m. vid köp över 10 000 kr.",
  },
  {
    id: "power-012",
    title: "10% rabatt för nya kunder",
    description: "Välkomstrabatt för förstagångskunder hos Power",
    discount: "10%",
    uses: 789,
    type: "percentage",
    offerUrl: "/power/verify?id=power-012",
    expirationDate: "31/12/2025",
    moreInfo:
      "Registrera nytt konto och få 10% på ditt första köp.",
  },
];

const expiredCoupons: Coupon[] = [
  {
    id: "power-exp-001",
    title: "Black Friday - 70% rabatt på elektronik",
    description: "Historisk Black Friday-rabatt på utvalda produkter",
    discount: "70%",
    uses: 3456,
    type: "percentage",
    expired: true,
    offerUrl: "/power/verify?id=power-exp-001",
    expirationDate: "27/11/2024",
    moreInfo:
      "Black Friday-kampanjen har avslutats. Håll utkik efter liknande erbjudanden.",
  },
  {
    id: "power-exp-002",
    title: "Cyber Monday - 3000 kr rabatt på datorer",
    description: "Cyber Monday-erbjudande på laptops och stationära datorer",
    discount: "3000 kr",
    uses: 789,
    type: "amount",
    expired: true,
    offerUrl: "/power/verify?id=power-exp-002",
    expirationDate: "28/11/2024",
    moreInfo:
      "Kampanjen erbjöd 3000 kr rabatt på datorer över 12 000 kr.",
  },
];

export default function PowerPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowOfferPopup(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCouponSelect = (coupon: Coupon) => {
    const newUrl = `/power/offer/${coupon.id}#td-offer${coupon.id}`;
    window.history.pushState({ offerId: coupon.id }, "", newUrl);
    setSelectedCoupon(coupon);
  };

  const handleModalClose = () => {
    window.history.pushState({}, "", "/power");
    setSelectedCoupon(null);
  };

  const getDiscountDisplay = (discount: string, type: string) => {
    if (type === "super") return "SUPER Rabatt";
    if (type === "free") return "GRATIS Rabatt";
    return `${discount} Rabatt`;
  };

  const topOffer = {
    title: "Få upp till 50% rabatt på utvalda produkter",
    discount: "50%",
    description:
      "Spara stort på elektronik, vitvaror och teknikprodukter hos Power",
    offerUrl: "/power/verify?id=power-001",
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="hidden md:block">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-green-600">Hem</a>
            <span className="w-4 h-4">›</span>
            <span className="text-gray-900 font-bold">Power</span>
          </nav>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 mt-4 md:mt-6">
          <div className="flex-1 min-w-0">
            {/* Hero */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              <div className="w-20 h-12 sm:w-24 sm:h-16 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200 p-2 flex-shrink-0">
                <img
                  src="https://media.power-cdn.net/images/logos/powerse/logo.svg"
                  alt="Power Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  Power Rabattkoder
                </h1>
                <p className="text-blue-600 text-base sm:text-lg mt-1">
                  Spara stort på elektronik och vitvaror – uppdaterad dagligen
                </p>
              </div>
            </div>

            {/* Top list */}
            <section className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Topp Power rabattkoder för{" "}
                {new Date().toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="text-xs md:text-sm text-gray-500 mb-4">
                När du gör ett köp kan vi tjäna en provision.
              </div>
              <div className="space-y-3 md:space-y-4">
                {powerCoupons.map((coupon) => (
<CouponCard
  key={coupon.id}
  coupon={coupon}
  onSelectCoupon={() => handleCouponSelect(coupon)}
/>

                ))}
              </div>
            </section>

            {/* Table */}
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
                              {coupon.type === "super"
                                ? "SUPER Rabatt"
                                : coupon.type === "free"
                                ? "GRATIS Rabatt"
                                : `${coupon.discount} Rabatt`}
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

            {/* Expired */}
            <section className="mt-8 md:mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Utgångna rabattkoder
              </h2>
              <div className="space-y-3 md:space-y-4">
                {expiredCoupons.map((coupon) => (
<CouponCard
  key={coupon.id}
  coupon={coupon}
  onSelectCoupon={() => handleCouponSelect(coupon)}
/>

                ))}
              </div>
            </section>

            {/* Simple info block kept as-is */}
            <section className="mt-12 prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Mer information om Power Sverige
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <p className="text-gray-700">
                  Power är en ledande nordisk återförsäljare av
                  elektronik och vitvaror med butiker i hela Norden.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0" />
        </div>
      </main>
      <Footer />
      {selectedCoupon && (
        <CouponModal
          coupon={selectedCoupon}
          onClose={handleModalClose}
          storeName="Power"
        />
      )}
      <OfferPopup
        isOpen={showOfferPopup}
        onClose={() => setShowOfferPopup(false)}
        storeName="Power"
        offer={topOffer}
      />
    </div>
  );
}
