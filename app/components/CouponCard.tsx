"use client"

import { useState } from "react"

interface Coupon {
  id: string
  title: string
  description: string
  discount: string
  code?: string
  uses: number
  type: "percentage" | "amount" | "free" | "super"
  expired?: boolean
  moreInfo?: string
  offerUrl?: string
}

interface CouponCardProps {
  coupon: Coupon
  onUseDiscount: () => void
}

export default function CouponCard({ coupon, onUseDiscount }: CouponCardProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const getDiscountBadgeColor = (type: string) => {
    switch (type) {
      case "super":
        return "bg-blue-500"
      case "free":
        return "bg-green-500"
      case "amount":
        return "bg-blue-600"
      default:
        return "bg-blue-500"
    }
  }

  const getDiscountText = (discount: string, type: string) => {
    if (type === "super") return "SUPER"
    if (type === "free") return "GRATIS"
    return discount
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow ${
        coupon.expired ? "opacity-60" : ""
      }`}
    >
      {/* Mobile Layout */}
      <div className="block sm:hidden space-y-4">
        <div className="flex items-start justify-between">
          <div
            className={`${getDiscountBadgeColor(coupon.type)} text-white px-3 py-2 rounded-lg font-bold text-base min-w-[70px] text-center ${
              coupon.expired ? "bg-gray-400" : ""
            }`}
          >
            {getDiscountText(coupon.discount, coupon.type)}
          </div>
          <button
            onClick={onUseDiscount}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              coupon.expired
                ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Använd
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
            {coupon.title}
            {coupon.expired && <span className="text-red-500 text-sm ml-2">(Utgången)</span>}
          </h3>
          <p className="text-gray-600 mb-2 text-sm leading-relaxed">{coupon.description}</p>
          <p className="text-sm text-gray-500 mb-2">{coupon.uses} användningar</p>
          <button className="text-blue-600 text-sm hover:underline" onClick={() => setShowMoreInfo(!showMoreInfo)}>
            Mer information {showMoreInfo ? "▲" : "▼"}
          </button>
          {showMoreInfo && coupon.moreInfo && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700 leading-relaxed">{coupon.moreInfo}</div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div
            className={`${getDiscountBadgeColor(coupon.type)} text-white px-3 py-2 rounded-lg font-bold text-lg min-w-[80px] text-center ${
              coupon.expired ? "bg-gray-400" : ""
            }`}
          >
            {getDiscountText(coupon.discount, coupon.type)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {coupon.title}
              {coupon.expired && <span className="text-red-500 text-sm ml-2">(Utgången)</span>}
            </h3>
            <p className="text-gray-600 mb-3">{coupon.description}</p>
            <p className="text-sm text-gray-500">{coupon.uses} användningar</p>
            <button className="text-blue-600 text-sm hover:underline" onClick={() => setShowMoreInfo(!showMoreInfo)}>
              Mer information {showMoreInfo ? "▲" : "▼"}
            </button>
            {showMoreInfo && coupon.moreInfo && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">{coupon.moreInfo}</div>
            )}
          </div>
        </div>
        <button
          onClick={onUseDiscount}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ml-4 ${
            coupon.expired
              ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Använd rabatten
        </button>
      </div>
    </div>
  )
}
