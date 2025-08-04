"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function OfferPage() {
  const params = useParams()
  const router = useRouter()
  const offerId = params.offerId as string

  useEffect(() => {
    // Redirect back to main page after a short delay
    // This page exists just to show the unique URL structure
    const timer = setTimeout(() => {
      router.push("/")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">E</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Elgiganten Erbjudande</h1>
        <p className="text-gray-600 mb-4">Erbjudande ID: {offerId}</p>
        <p className="text-sm text-gray-500">Omdirigerar tillbaka till huvudsidan...</p>
      </div>
    </div>
  )
}
