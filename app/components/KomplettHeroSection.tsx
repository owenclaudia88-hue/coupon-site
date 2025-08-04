"use client"

import { useState } from "react"
import CouponModal from "./CouponModal"

const featuredCoupon = {
  id: "komp-hero-001",
  title: "Specialerbjudande – Upp till 45% rabatt på datorer",
  description: "Spara stort på de senaste datorerna hos Komplett",
  discount: "45%",
  uses: 847,
  type: "percentage" as const,
  offerUrl: "https://www.komplett.se",
  moreInfo: "Ingen kod behövs – rabatten tillämpas automatiskt",
}

export default function KomplettHeroSection() {
  const [showModal, setShowModal] = useState(false)

  const handleGetCoupon = () => {
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <section className="mb-6 md:mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="bg-purple-600 text-white px-3 py-2 rounded-lg font-bold text-lg flex-shrink-0">45%</div>
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  Specialerbjudande – Upp till 45% rabatt på datorer
                </h2>
                <p className="text-gray-600 text-sm md:text-base mb-1">
                  Spara stort på de senaste datorerna hos Komplett
                </p>
                <p className="text-purple-600 text-xs md:text-sm">Ingen kod behövs – rabatten tillämpas automatiskt</p>
              </div>
            </div>
            <button
              onClick={handleGetCoupon}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-colors duration-200 flex-shrink-0"
            >
              Använd rabatt
            </button>
          </div>
        </div>
      </section>

      {showModal && <CouponModal coupon={featuredCoupon} onClose={handleModalClose} storeName="Komplett" />}
    </>
  )
}
