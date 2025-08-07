'use client'

import { useState } from 'react'
import SecurityCaptcha from '../../components/SecurityCaptcha'
import { useRouter } from 'next/navigation'

export default function CaptchaRedirect({ redirectUrl }: { redirectUrl: string }) {
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
          Verifierad! Om du inte omdirigeras automatiskt,{' '}
          <a className="text-blue-600 underline" href={redirectUrl}>klicka här</a>.
        </div>
      )}
    </div>
  )
}
