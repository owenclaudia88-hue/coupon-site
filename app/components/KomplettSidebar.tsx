"use client"

import type React from "react"

import { useState } from "react"
import { TrendingUp, Users, Monitor, Cpu, Gamepad2, Smartphone, Headphones } from "lucide-react"

export default function KomplettSidebar() {
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "already_subscribed">("idle")
  const [subscribedEmails, setSubscribedEmails] = useState<Set<string>>(new Set())

  // Calculate statistics based on actual offers (9 offers from komplett/page.tsx)
  const totalOffers = 9
  const activeOffers = 9
  const averageSavings = Math.round((45 + 25 + 20 + 30 + 35 + 15 + 40 + 25 + 30) / 9) // 29%

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

    setTimeout(() => {
      setSubscriptionStatus("idle")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Komplett Statistik</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Totala erbjudanden</span>
            <span className="font-bold text-purple-600">{totalOffers}+</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Aktiva rabattkoder</span>
            <span className="font-bold text-purple-600">{activeOffers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Genomsnittlig besparing</span>
            <span className="font-bold text-purple-600">{averageSavings}%</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Teknik kategorier</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Monitor className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-gray-700">Datorer & Laptops</span>
            </div>
            <span className="text-purple-600 font-medium">3 erbjudanden</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Cpu className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-gray-700">Komponenter</span>
            </div>
            <span className="text-purple-600 font-medium">2 erbjudanden</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Gamepad2 className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-gray-700">Gaming</span>
            </div>
            <span className="text-purple-600 font-medium">2 erbjudanden</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Smartphone className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-gray-700">Mobiler & Surfplattor</span>
            </div>
            <span className="text-purple-600 font-medium">1 erbjudande</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Headphones className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-gray-700">Ljud & Bild</span>
            </div>
            <span className="text-purple-600 font-medium">1 erbjudande</span>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-2">Teknik erbjudanden</h3>
        <p className="text-gray-600 text-sm mb-4">
          Få de senaste rabattkoderna och teknik-erbjudandena från Komplett direkt i din inkorg.
        </p>

        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Din e-postadress"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Prenumerera nu
          </button>
        </form>

        {subscriptionStatus === "success" && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">Tack! Du kommer att få våra bästa teknik-erbjudanden.</p>
          </div>
        )}

        {subscriptionStatus === "already_subscribed" && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-800 text-sm font-medium">Den här e-postadressen har redan använts.</p>
          </div>
        )}
      </div>

      {/* Popular Times */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Populära tider</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Måndag - Fredag</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Hög aktivitet</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Helger</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Medel aktivitet</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Black Friday</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Mycket hög</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
