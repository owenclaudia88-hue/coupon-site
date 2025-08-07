// app/elgiganten/verify/page.tsx
'use client'

import { useState } from 'react'
import SecurityCaptcha from '@/components/SecurityCaptcha'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function VerifyPage() {
  const [solved, setSolved] = useState(false)

  const handleSuccess = () => {
    setSolved(true)
    setTimeout(() => {
      window.location.href = 'https://your-custom-domain.com' // <- replace with real URL
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 py-16 px-4">
        {!solved ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-4">
              Verifiera att du är en människa
            </h1>
            <p className="text-gray-600 text-center mb-8">
              För att se detta exklusiva erbjudande, lös captchan nedan:
            </p>
            <SecurityCaptcha onSuccess={handleSuccess} />
          </>
        ) : (
          <p className="text-green-600 text-lg font-semibold">
            ✅ Verifierad! Du omdirigeras...
          </p>
        )}
      </main>
      <Footer />
    </div>
  )
}
