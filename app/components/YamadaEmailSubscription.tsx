"use client"

import type React from "react"
import { useState } from "react"

export default function YamadaEmailSubscription() {
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

    setTimeout(() => {
      setSubscriptionStatus("idle")
    }, 3000)
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6 mt-6 md:mt-8">
      <div className="text-center">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
          最新のお得情報をメールでお届け
        </h3>
        <p className="text-gray-600 mb-4 text-sm md:text-base">
          ニュースレターに登録して、最新のクーポンやセール情報をいち早くゲットしましょう
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力"
            className="flex-1 px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-sm"
            required
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 md:py-2 rounded-lg font-semibold transition-colors text-base md:text-sm"
          >
            登録する
          </button>
        </form>

        {subscriptionStatus === "success" && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">
              ご登録ありがとうございます！最新のお得情報をお届けします。
            </p>
          </div>
        )}

        {subscriptionStatus === "already_subscribed" && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-800 text-sm font-medium">
              このメールアドレスはすでに登録済みです。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
