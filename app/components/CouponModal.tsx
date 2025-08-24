"use client"

import type React from "react"
import { useState } from "react"
import { X, ExternalLink } from "lucide-react"

interface Coupon {
  id: string
  title: string
  description: string
  discount: string
  uses: number
  type: "percentage" | "amount" | "free" | "super"
  offerUrl: string
  moreInfo?: string
}

interface CouponModalProps {
  coupon: Coupon
  onClose: () => void
  storeName: string
}

export default function CouponModal({ coupon, onClose, storeName }: CouponModalProps) {
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<"idle" | "success" | "already_subscribed">("idle")
  const [subscribedEmails, setSubscribedEmails] = useState<Set<string>>(new Set())

  // 👉 Direct redirect helper (no puzzle)
  const redirectToOffer = () => {
    const redirectUrl = coupon.offerUrl || "https://www.elgiganten.se"
    onClose()
    setTimeout(() => {
      window.location.href = redirectUrl
    }, 150)
  }

  // Keep the old handler name so you don’t need to change anything else
  const handleGetCode = () => {
    redirectToOffer()
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

    setTimeout(() => setSubscriptionStatus("idle"), 3000)
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="bg-white rounded-xl w-full max-w-md mx-auto p-4 md:p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-12 md:w-24 md:h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200 p-2">
            <img
              src={
                storeName === "Power"
                  ? "https://media.power-cdn.net/images/logos/powerse/logo.svg"
                  : storeName === "NetOnNet"
                  ? "/images/netonnet-logo.svg"
                  : storeName === "Webhallen"
                  ? "/images/webhallen-logo.png"
                  : storeName === "Komplett"
                  ? "/images/komplett-logo.svg"
                  : storeName === "CDON"
                  ? "/images/cdon-logo.png"
                  : "/images/elgiganten-logo.svg"
              }
              alt={`${storeName} Logo`}
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
            {coupon.title}
          </h2>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-700 font-semibold">Ingen kod behövs</p>
        </div>

        <button
          onClick={handleGetCode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-4 md:mb-6 transition-colors flex items-center justify-center space-x-2 text-base"
        >
          <span>Använd rabatten</span>
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Email Subscription Section */}
        <div className="border-t pt-6">
          <div className="flex items-start mb-3">
            <div className="w-10 h-6 md:w-12 md:h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm border border-gray-200 p-1 flex-shrink-0">
              <img
                src={
                  storeName === "Power"
                    ? "https://media.power-cdn.net/images/logos/powerse/logo.svg"
                    : storeName === "NetOnNet"
                    ? "/images/netonnet-logo.svg"
                    : storeName === "Webhallen"
                    ? "/images/webhallen-logo.png"
                    : storeName === "Komplett"
                    ? "/images/komplett-logo.svg"
                    : storeName === "CDON"
                    ? "/images/cdon-logo.png"
                    : "/images/elgiganten-logo.svg"
                }
                alt={`${storeName} Logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                Missa aldrig {storeName} rabattkoder igen
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Dra nytta av de bästa rabattkoderna och erbjudandena från tusentals butiker
              </p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ange din e-postadress"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors text-base"
            >
              Prenumerera
            </button>
          </form>

          {subscriptionStatus === "success" && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                Tack för din prenumeration! Du kommer nu att få de senaste rabattkoderna.
              </p>
            </div>
          )}

          {subscriptionStatus === "already_subscribed" && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 text-sm font-medium">
                Denna e-postadress är redan prenumererad på vårt nyhetsbrev.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

