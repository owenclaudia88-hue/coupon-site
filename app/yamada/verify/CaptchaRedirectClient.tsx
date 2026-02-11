'use client'

import { useState } from 'react'
import SecurityCaptcha from '../../../components/SecurityCaptcha'
import { useRouter } from 'next/navigation'

export default function CaptchaRedirectClient({ redirectUrl }: { redirectUrl: string }) {
  const [verified, setVerified] = useState(false)
  const router = useRouter()

  const handleVerification = () => {
    setVerified(true)
    setTimeout(() => {
      window.location.href = redirectUrl
    }, 300)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {!verified ? (
        <SecurityCaptcha onVerify={handleVerification} />
      ) : (
        <div className="text-center text-lg font-medium text-gray-700">
          確認済み！自動的にリダイレクトされない場合は、{' '}
          <a className="text-red-600 underline" href={redirectUrl}>こちらをクリック</a>
          してください。
        </div>
      )}
    </div>
  )
}
