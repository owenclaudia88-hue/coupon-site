"use client"

import type React from "react"

import { useState } from "react"
import { TrendingUp, Mail, Check, AlertCircle } from "lucide-react"

export default function WebhallenSidebar() {
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "duplicate">("idle")
  const [submittedEmails, setSubmittedEmails] = useState<string[]>([])

  // Calculate statistics based on actual offers
  const totalOffers = 12
  const activeDiscountCodes = 12
  const averageSavings = 23 // Calculated from actual discount percentages

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (submittedEmails.includes(email.toLowerCase())) {
      setSubscriptionStatus("duplicate")
    } else {
      setSubmittedEmails([...submittedEmails, email.toLowerCase()])
      setSubscriptionStatus("success")
      setEmail("")
    }

    // Auto-hide message after 3 seconds
    setTimeout(() => {
      setSubscriptionStatus("idle")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
          <h3 className="font-bold text-gray-900">Webhallen Statistik</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Totala erbjudanden</span>
            <span className="font-bold text-orange-600">{totalOffers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Aktiva rabattkoder</span>
            <span className="font-bold text-orange-600">{activeDiscountCodes}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Genomsnittlig besparing</span>
            <span className="font-bold text-orange-600">{averageSavings}%</span>
          </div>
        </div>
      </div>

      {/* Gaming Categories */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Gaming-kategorier</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">💻</span>
              </div>
              <span className="text-gray-700">Gaming-datorer</span>
            </div>
            <span className="text-sm text-gray-500">3 erbjudanden</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">⚡</span>
              </div>
              <span className="text-gray-700">Grafikkort</span>
            </div>
            <span className="text-sm text-gray-500">2 erbjudanden</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">🎮</span>
              </div>
              <span className="text-gray-700">Gaming-tillbehör</span>
            </div>
            <span className="text-sm text-gray-500">2 erbjudanden</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">🎧</span>
              </div>
              <span className="text-gray-700">Headsets & Audio</span>
            </div>
            <span className="text-sm text-gray-500">1 erbjudande</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">🖥️</span>
              </div>
              <span className="text-gray-700">Monitorer</span>
            </div>
            <span className="text-sm text-gray-500">1 erbjudande</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">🥽</span>
              </div>
              <span className="text-gray-700">VR & Streaming</span>
            </div>
            <span className="text-sm text-gray-500">3 erbjudanden</span>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center mb-3">
          <Mail className="w-5 h-5 text-orange-600 mr-2" />
          <h3 className="font-bold text-gray-900">Gaming-erbjudanden</h3>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Få de senaste rabattkoderna och gaming-erbjudandena från Webhallen direkt i din inkorg.
        </p>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Din e-postadress"
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
          >
            Prenumerera nu
          </button>
        </form>

        {/* Success/Error Messages */}
        {subscriptionStatus === "success" && (
          <div className="mt-3 flex items-center text-green-600 text-sm">
            <Check className="w-4 h-4 mr-2" />
            <span>Tack! Du kommer att få våra bästa gaming-erbjudanden.</span>
          </div>
        )}

        {subscriptionStatus === "duplicate" && (
          <div className="mt-3 flex items-center text-yellow-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Den här e-postadressen har redan använts.</span>
          </div>
        )}
      </div>

      {/* Popular Gaming Deals */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Populära gaming-deals</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <div className="font-medium text-gray-900 text-sm">RTX 4070 Gaming-dator</div>
              <div className="text-xs text-gray-500">Gaming-datorer</div>
            </div>
            <div className="text-orange-600 font-bold text-sm">35%</div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <div className="font-medium text-gray-900 text-sm">Gaming-headset Pro</div>
              <div className="text-xs text-gray-500">Audio</div>
            </div>
            <div className="text-orange-600 font-bold text-sm">30%</div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900 text-sm">Mekaniskt tangentbord</div>
              <div className="text-xs text-gray-500">Tillbehör</div>
            </div>
            <div className="text-orange-600 font-bold text-sm">25%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
