'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CaptchaRedirectClientWrapper() {
  const searchParams = useSearchParams()
  const offerId = searchParams.get('id')

  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setVerified(true)
  }, [])

  useEffect(() => {
    if (verified && offerId) {
      console.log('Making request to /api/get-offer-url...')

      fetch('/api/get-offer-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: offerId, store: 'yamada' }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Offer not found')
          return res.json()
        })
        .then((data) => {
          console.log('Received redirect URL:', data.url)
          setTimeout(() => {
            window.location.href = data.url
          }, 300)
        })
        .catch((err) => {
          console.error(err)
          setError('オファーの読み込みに失敗しました。')
        })
    }
  }, [verified, offerId])

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>
  }

  return (
    <div className="flex justify-center items-center min-h-[150px]">
      <p>オファーを確認中...</p>
    </div>
  )
}
