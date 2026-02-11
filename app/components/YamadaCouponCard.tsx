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

interface YamadaCouponCardProps {
  coupon: Coupon
  onSelectCoupon?: (coupon: Coupon) => void
}

export default function YamadaCouponCard({ coupon, onSelectCoupon }: YamadaCouponCardProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const getDiscountBadgeColor = (type: string, expired?: boolean) => {
    if (expired) return "bg-gray-400"
    switch (type) {
      case "super":
        return "bg-red-600"
      case "free":
        return "bg-red-500"
      case "amount":
        return "bg-[#003478]"
      default:
        return "bg-red-600"
    }
  }

  const getDiscountText = (discount: string, type: string) => {
    if (type === "super") return "SUPER"
    if (type === "free") return "無料"
    return discount
  }

  const handleClick = () => {
    if (onSelectCoupon) {
      onSelectCoupon(coupon)
    }
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
            className={`${getDiscountBadgeColor(coupon.type, coupon.expired)} text-white px-3 py-2 rounded-lg font-bold text-base min-w-[70px] text-center`}
          >
            {getDiscountText(coupon.discount, coupon.type)}
          </div>
          <button
            onClick={handleClick}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              coupon.expired
                ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            使う
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
            {coupon.title}
            {coupon.expired && <span className="text-red-500 text-sm ml-2">(期限切れ)</span>}
          </h3>
          <p className="text-gray-600 mb-2 text-sm leading-relaxed">{coupon.description}</p>
          <p className="text-sm text-gray-500 mb-2">{coupon.uses.toLocaleString()}回利用</p>
          <button className="text-red-600 text-sm hover:underline" onClick={() => setShowMoreInfo(!showMoreInfo)}>
            詳細情報 {showMoreInfo ? "▲" : "▼"}
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
            className={`${getDiscountBadgeColor(coupon.type, coupon.expired)} text-white px-3 py-2 rounded-lg font-bold text-lg min-w-[80px] text-center`}
          >
            {getDiscountText(coupon.discount, coupon.type)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {coupon.title}
              {coupon.expired && <span className="text-red-500 text-sm ml-2">(期限切れ)</span>}
            </h3>
            <p className="text-gray-600 mb-3">{coupon.description}</p>
            <p className="text-sm text-gray-500">{coupon.uses.toLocaleString()}回利用</p>
            <button className="text-red-600 text-sm hover:underline" onClick={() => setShowMoreInfo(!showMoreInfo)}>
              詳細情報 {showMoreInfo ? "▲" : "▼"}
            </button>
            {showMoreInfo && coupon.moreInfo && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">{coupon.moreInfo}</div>
            )}
          </div>
        </div>
        <button
          onClick={handleClick}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ml-4 ${
            coupon.expired
              ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          クーポンを使う
        </button>
      </div>
    </div>
  )
}
