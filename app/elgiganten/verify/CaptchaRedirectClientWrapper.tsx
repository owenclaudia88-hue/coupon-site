'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CaptchaRedirectClientWrapper() {
  const searchParams = useSearchParams()
  const offerId = searchParams.get('id')

  useEffect(() => {
    if (offerId) {
      fetch('/api/get-offer-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: offerId }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Offer not found')
          return res.json()
        })
        .then((data) => {
          window.location.href = data.url
        })
        .catch(() => {
          // Fail silently to keep the page blank
        })
    }
  }, [offerId])

  return null // completely blank page
}







