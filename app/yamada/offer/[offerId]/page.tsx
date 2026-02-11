"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function OfferPage() {
  const params = useParams()
  const router = useRouter()
  const offerId = params.offerId as string

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/yamada")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-200 p-2">
          <img src="/images/yamada-logo.png" alt="ヤマダデンキ" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ヤマダデンキ オファー</h1>
        <p className="text-gray-600 mb-4">オファーID: {offerId}</p>
        <p className="text-sm text-gray-500">メインページにリダイレクト中...</p>
      </div>
    </div>
  )
}
