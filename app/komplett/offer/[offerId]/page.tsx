"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function KomplettOfferPage() {
  const params = useParams()
  const router = useRouter()
  const offerId = params.offerId as string

  useEffect(() => {
    // Redirect back to Komplett page after a short delay
    // This page exists just to show the unique URL structure
    const timer = setTimeout(() => {
      router.push("/komplett")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200 p-2">
          <img src="/images/komplett-logo.svg" alt="Komplett Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Komplett Erbjudande</h1>
        <p className="text-gray-600 mb-4">Erbjudande ID: {offerId}</p>
        <p className="text-sm text-gray-500" aria-live="polite">
          Omdirigerar tillbaka till Komplett-sidan...
        </p>

        {/* Fallback action in case redirect is blocked */}
        <button
          onClick={() => router.push("/komplett")}
          className="mt-6 inline-flex items-center px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
        >
          Gå tillbaka nu
        </button>
      </div>
    </div>
  )
}
