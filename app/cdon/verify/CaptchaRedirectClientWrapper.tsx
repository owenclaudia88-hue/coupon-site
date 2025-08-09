"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function CaptchaRedirectClientWrapper() {
  const searchParams = useSearchParams()
  const offerId = searchParams.get("id")

  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // For now we auto-verify (same as Elgiganten); swap to your puzzle when ready.
  useEffect(() => {
    setVerified(true)
  }, [])

  useEffect(() => {
    if (!verified || !offerId) return

    fetch("/api/get-offer-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // tell the API which store to use (also inferred from referer, this is just explicit)
      body: JSON.stringify({ id: offerId, store: "cdon" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Offer not found")
        return res.json()
      })
      .then((data) => {
        setTimeout(() => {
          window.location.href = data.url
        }, 300)
      })
      .catch((err) => {
        console.error(err)
        setError("Kunde inte ladda erbjudandet.")
      })
  }, [verified, offerId])

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>
  }

  return (
    <div className="flex justify-center items-center min-h-[150px]">
      <p>Kontrollerar erbjudandet...</p>
    </div>
  )
}
