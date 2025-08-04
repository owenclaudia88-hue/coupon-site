"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, RotateCcw, ExternalLink } from "lucide-react"

interface Coupon {
  id: string
  title: string
  description: string
  discount: string
  uses: number
  type: "percentage" | "amount" | "free" | "super"
  offerUrl: string
  moreInfo?: string
}

interface CouponModalProps {
  coupon: Coupon
  onClose: () => void
  storeName: string
}

export default function CouponModal({ coupon, onClose, storeName }: CouponModalProps) {
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [piecePosition, setPiecePosition] = useState({ x: 20, y: 50 })
  const [isCompleted, setIsCompleted] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const [email, setEmail] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const [feedbackType, setFeedbackType] = useState<"positive" | "negative" | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "already_subscribed">("idle")
  const [subscribedEmails, setSubscribedEmails] = useState<Set<string>>(new Set())
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const pieceRef = useRef<HTMLDivElement>(null)

  // Target position (where the piece should go) - 60% from left, 50% from top
  const targetPosition = { x: 60, y: 50 }

  const redirectToOffer = () => {
    const redirectUrl = coupon.offerUrl || "https://www.elgiganten.se"
    window.open(redirectUrl, "_blank")

    setTimeout(() => {
      setShowPuzzle(false)
      setShowFeedback(true)
    }, 1000)
  }

  useEffect(() => {
    if (showPuzzle) {
      resetPuzzle()
    }
  }, [showPuzzle])

  const resetPuzzle = () => {
    setPiecePosition({ x: 20, y: 50 }) // Start position
    setIsCompleted(false)
    setIsVerifying(false)
    setShowSuccess(false)
    setFailed(false)
    setCurrentImageIndex(Math.floor(Math.random() * puzzleImages.length))
  }

  const handleGetCode = () => {
    setShowPuzzle(true)
  }

  const handlePuzzleComplete = () => {
    setShowPuzzle(false)
    setIsVerified(true)
    // Generate a realistic coupon code
    const codes = ["SAVE20", "TECH15", "STUDENT10", "WELCOME25", "FLASH30"]
    setCouponCode(codes[Math.floor(Math.random() * codes.length)])
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode)
  }

  const handleVisitStore = () => {
    window.open(coupon.offerUrl, "_blank")
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    const normalizedEmail = email.toLowerCase().trim()

    if (subscribedEmails.has(normalizedEmail)) {
      setSubscriptionStatus("already_subscribed")
    } else {
      setSubscribedEmails((prev) => new Set([...prev, normalizedEmail]))
      setSubscriptionStatus("success")
      setEmail("")
    }

    setTimeout(() => {
      setSubscriptionStatus("idle")
    }, 3000)
  }

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedbackType(type)
    setFeedbackGiven(true)

    setTimeout(() => {
      setShowFeedback(false)
      onClose()
    }, 3000)
  }

  const closeFeedback = () => {
    setShowFeedback(false)
    onClose()
  }

  // Drag and drop handlers for puzzle piece
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCompleted || isVerifying) return
    setIsDragging(true)

    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    })
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || isCompleted) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newX = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100
    const newY = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100

    // Constrain within container bounds
    const constrainedX = Math.max(10, Math.min(90, newX))
    const constrainedY = Math.max(10, Math.min(90, newY))

    setPiecePosition({ x: constrainedX, y: constrainedY })
  }

  const handleMouseUp = () => {
    if (!isDragging || isCompleted || isVerifying) {
      setIsDragging(false)
      return
    }

    // Check if piece is close to target (within 12% tolerance) when released
    const distanceX = Math.abs(piecePosition.x - targetPosition.x)
    const distanceY = Math.abs(piecePosition.y - targetPosition.y)

    if (distanceX < 12 && distanceY < 12) {
      setIsDragging(false)
      setIsVerifying(true)
      setPiecePosition(targetPosition) // Snap to exact position
      setShowSuccess(true)

      // Simulate verification process
      setTimeout(() => {
        setIsCompleted(true)
        setIsVerifying(false)

        // Redirect after success
        setTimeout(() => {
          redirectToOffer()
        }, 1500)
      }, 1500)
    } else {
      // If not close enough to target, return to start position
      setPiecePosition({ x: 20, y: 50 })
      setFailed(true)
      setTimeout(() => setFailed(false), 1000)
    }
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isCompleted || isVerifying) return
    setIsDragging(true)

    const rect = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0]
    setDragOffset({
      x: touch.clientX - rect.left - rect.width / 2,
      y: touch.clientY - rect.top - rect.height / 2,
    })
    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current || isCompleted) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const newX = ((touch.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100
    const newY = ((touch.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100

    const constrainedX = Math.max(10, Math.min(90, newX))
    const constrainedY = Math.max(10, Math.min(90, newY))

    setPiecePosition({ x: constrainedX, y: constrainedY })
  }

  const handleTouchEnd = () => {
    if (!isDragging || isCompleted || isVerifying) {
      setIsDragging(false)
      return
    }

    const distanceX = Math.abs(piecePosition.x - targetPosition.x)
    const distanceY = Math.abs(piecePosition.y - targetPosition.y)

    if (distanceX < 12 && distanceY < 12) {
      setIsDragging(false)
      setIsVerifying(true)
      setPiecePosition(targetPosition)
      setShowSuccess(true)

      setTimeout(() => {
        setIsCompleted(true)
        setIsVerifying(false)

        setTimeout(() => {
          redirectToOffer()
        }, 1500)
      }, 1500)
    } else {
      setPiecePosition({ x: 20, y: 50 })
      setFailed(true)
      setTimeout(() => setFailed(false), 1000)
    }
    setIsDragging(false)
  }

  const puzzleImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1501594907352-04cda3a7fe05?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-b2761acb3c5d?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1433086966358-59a10b8d2000?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop",
  ]

  // Show feedback modal
  if (showFeedback) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <div className="bg-white rounded-xl w-full max-w-sm mx-4 p-6 relative shadow-2xl">
          <button onClick={closeFeedback} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={closeFeedback}
                className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                TILLBAKA TILL RABATTKOD
              </button>
            </div>

            {!feedbackGiven ? (
              <>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Fungerade rabattkoden?</h2>

                <div className="flex justify-center space-x-4 md:space-x-6">
                  <button
                    onClick={() => handleFeedback("positive")}
                    className="w-16 h-16 md:w-20 md:h-20 bg-green-600 hover:bg-green-700 rounded-xl flex items-center justify-center transition-colors shadow-lg"
                  >
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3v11z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleFeedback("negative")}
                    className="w-16 h-16 md:w-20 md:h-20 bg-green-600 hover:bg-green-700 rounded-xl flex items-center justify-center transition-colors shadow-lg"
                  >
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521C4.537 3.997 5.136 3.75 5.754 3.75h4.018a4.498 4.498 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Tack för din feedback.</h2>

                <div className="flex justify-center space-x-4 md:space-x-6">
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center shadow-lg ${
                      feedbackType === "positive" ? "bg-green-600" : "bg-gray-400"
                    }`}
                  >
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3v11z" />
                    </svg>
                  </div>

                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center shadow-lg ${
                      feedbackType === "negative" ? "bg-green-600" : "bg-gray-400"
                    }`}
                  >
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521C4.537 3.997 5.136 3.75 5.754 3.75h4.018a4.498 4.498 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show puzzle modal
  if (showPuzzle) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-white rounded-xl w-full max-w-lg mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative p-4 md:p-6 pb-3 md:pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Stäng"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-20 h-12 md:w-24 md:h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200 p-2">
                <img
                  src={
                    storeName === "Power"
                      ? "https://media.power-cdn.net/images/logos/powerse/logo.svg"
                      : storeName === "NetOnNet"
                        ? "/images/netonnet-logo.svg"
                        : storeName === "Webhallen"
                          ? "/images/webhallen-logo.png"
                          : storeName === "Komplett"
                            ? "/images/komplett-logo.svg"
                            : storeName === "CDON"
                              ? "/images/cdon-logo.png"
                              : "/images/elgiganten-logo.svg"
                  }
                  alt={`${storeName} Logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Säkerhetsverifiering</h2>
              <p className="text-gray-600 text-sm md:text-base">Dra pusselbiten till rätt plats</p>
            </div>
          </div>

          {/* Puzzle Image Container */}
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <div
              ref={containerRef}
              className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-gray-100 select-none"
            >
              {/* Background Image */}
              <img
                src={puzzleImages[currentImageIndex] || "/placeholder.svg"}
                alt="Pusselbilder"
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Target hole (where piece should go) */}
              <div
                className={`absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full border-2 border-dashed ${
                  isCompleted ? "border-green-500" : "border-gray-400"
                }`}
                style={{
                  left: `${targetPosition.x}%`,
                  top: `${targetPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "inset 0 0 15px rgba(0,0,0,0.2)",
                }}
              />

              {/* Draggable puzzle piece */}
              <div
                ref={pieceRef}
                className={`absolute w-12 h-12 md:w-16 md:h-16 rounded-full border-4 cursor-move transition-all duration-200 overflow-hidden ${
                  isDragging ? "scale-110 shadow-xl z-20" : "shadow-lg z-10"
                } ${
                  isCompleted
                    ? "border-green-500"
                    : failed
                      ? "border-red-500"
                      : isVerifying
                        ? "border-blue-500"
                        : "border-white"
                }`}
                style={{
                  left: `${piecePosition.x}%`,
                  top: `${piecePosition.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {isVerifying ? (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                    <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : failed ? (
                  <div className="w-full h-full bg-red-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg md:text-xl">✗</span>
                  </div>
                ) : (
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      backgroundImage: `url(${puzzleImages[currentImageIndex] || "/placeholder.svg"})`,
                      backgroundSize: `${containerRef.current?.offsetWidth || 400}px ${containerRef.current?.offsetHeight || 250}px`,
                      backgroundPosition: `-${(targetPosition.x / 100) * (containerRef.current?.offsetWidth || 400) - 24}px -${(targetPosition.y / 100) * (containerRef.current?.offsetHeight || 250) - 24}px`,
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 md:mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isCompleted && showSuccess
                  ? "Perfekt! Omdirigerar..."
                  : failed
                    ? "Försök igen - dra till den streckade cirkeln"
                    : isVerifying
                      ? "Verifierar..."
                      : "Dra den runda pusselbiten till den streckade cirkeln"}
              </p>
            </div>

            {/* Status Messages */}
            {isVerifying && (
              <div className="text-center mt-4">
                <div className="inline-flex items-center px-3 md:px-4 py-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-xs md:text-sm">Verifierar...</span>
                </div>
              </div>
            )}

            {showSuccess && (
              <div className="text-center mt-4">
                <div className="inline-flex items-center px-3 md:px-4 py-2 bg-green-50 text-green-800 rounded-lg border border-green-200">
                  <span className="mr-2 text-green-600 text-sm md:text-lg">✓</span>
                  <span className="text-xs md:text-sm">Verifierad! Omdirigerar...</span>
                </div>
              </div>
            )}

            {failed && (
              <div className="text-center mt-4">
                <div className="inline-flex items-center px-3 md:px-4 py-2 bg-red-50 text-red-800 rounded-lg border border-red-200">
                  <span className="mr-2 text-red-600">✗</span>
                  <span className="text-xs md:text-sm">Försök igen</span>
                </div>
              </div>
            )}

            {/* New Puzzle Button */}
            <div className="flex justify-center mt-4 md:mt-6">
              <button
                onClick={resetPuzzle}
                disabled={isVerifying || (isCompleted && showSuccess)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nytt pussel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show initial coupon modal
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="bg-white rounded-xl w-full max-w-md mx-auto p-4 md:p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-12 md:w-24 md:h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200 p-2">
            <img
              src={
                storeName === "Power"
                  ? "https://media.power-cdn.net/images/logos/powerse/logo.svg"
                  : storeName === "NetOnNet"
                    ? "/images/netonnet-logo.svg"
                    : storeName === "Webhallen"
                      ? "/images/webhallen-logo.png"
                      : storeName === "Komplett"
                        ? "/images/komplett-logo.svg"
                        : storeName === "CDON"
                          ? "/images/cdon-logo.png"
                          : "/images/elgiganten-logo.svg"
              }
              alt={`${storeName} Logo`}
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">{coupon.title}</h2>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-700 font-semibold">Ingen kod behövs</p>
        </div>

        <button
          onClick={handleGetCode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-4 md:mb-6 transition-colors flex items-center justify-center space-x-2 text-base"
        >
          <span>Använd rabatten</span>
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Email Subscription Section */}
        <div className="border-t pt-6">
          <div className="flex items-start mb-3">
            <div className="w-10 h-6 md:w-12 md:h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm border border-gray-200 p-1 flex-shrink-0">
              <img
                src={
                  storeName === "Power"
                    ? "https://media.power-cdn.net/images/logos/powerse/logo.svg"
                    : storeName === "NetOnNet"
                      ? "/images/netonnet-logo.svg"
                      : storeName === "Webhallen"
                        ? "/images/webhallen-logo.png"
                        : storeName === "Komplett"
                          ? "/images/komplett-logo.svg"
                          : storeName === "CDON"
                            ? "/images/cdon-logo.png"
                            : "/images/elgiganten-logo.svg"
                }
                alt={`${storeName} Logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                Missa aldrig {storeName} rabattkoder igen
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Dra nytta av de bästa rabattkoderna och erbjudandena från tusentals butiker
              </p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ange din e-postadress"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors text-base"
            >
              Prenumerera
            </button>
          </form>

          {/* Subscription status messages */}
          {subscriptionStatus === "success" && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                Tack för din prenumeration! Du kommer nu att få de senaste rabattkoderna.
              </p>
            </div>
          )}

          {subscriptionStatus === "already_subscribed" && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 text-sm font-medium">
                Denna e-postadress är redan prenumererad på vårt nyhetsbrev.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
