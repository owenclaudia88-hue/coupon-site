"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Link from "next/link"

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (!cookieConsent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "accepted")
    localStorage.setItem(
      "cookieSettings",
      JSON.stringify({
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
      }),
    )
    setIsVisible(false)
  }

  const handleDeclineAll = () => {
    localStorage.setItem("cookieConsent", "declined")
    localStorage.setItem(
      "cookieSettings",
      JSON.stringify({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      }),
    )
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 text-white p-4 shadow-lg">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Denna webbplats använder cookies</h3>
            <p className="text-sm text-gray-300 mb-2 md:mb-0">
              Denna webbplats använder cookies för att förbättra användarupplevelsen. Genom att använda vår webbplats
              samtycker du till alla cookies i enlighet med vår Cookie Policy.{" "}
              <Link href="/cookies" className="text-green-400 hover:text-green-300 underline">
                Läs mer
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-fit">
            <button
              onClick={handleAcceptAll}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              ACCEPTERA ALLA
            </button>
            <button
              onClick={handleDeclineAll}
              className="border border-gray-400 hover:border-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              AVVISA ALLA
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-2 transition-colors"
              aria-label="Stäng cookie-banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
