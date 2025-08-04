"use client"

import type React from "react"

import { useState } from "react"

export default function EmailSubscription() {
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "already_subscribed">("idle")
  const [subscribedEmails, setSubscribedEmails] = useState<Set<string>>(new Set())

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
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mt-6 md:mt-8">
      <div className="text-center">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
          Få de senaste erbjudandena direkt i din inkorg
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
              Tack för din prenumeration! Du kommer nu att få de senaste erbjudandena.
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
  )
}
