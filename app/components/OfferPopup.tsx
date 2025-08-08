"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, RotateCcw } from "lucide-react"

interface OfferPopupProps {
  isOpen: boolean
  onClose: () => void
  storeName: string
  offer: {
    title: string
    discount: string
    description: string
    offerUrl: string
  }
}

export default function OfferPopup({ isOpen, onClose, storeName, offer }: OfferPopupProps) {
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [piecePosition, setPiecePosition] = useState({ x: 20, y: 50 })
  const [isCompleted, setIsCompleted] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const pieceRef = useRef<HTMLDivElement>(null)

  // Target position (where the piece should go) - 60% from left, 50% from top
  const targetPosition = { x: 60, y: 50 }

  const puzzleImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=300&fit=crop",
    "https://picsum.photos/500/300?random=12",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-b2761acb3c5d?w=500&h=300&fit=crop",
  ]

const redirectToOffer = () => {
  setShowPuzzle(false)
  onClose()
  setTimeout(() => {
    window.location.href = offer.offerUrl
  }, 300) // slightly delayed to allow modal to close
}


  useEffect(() => {
    if (showPuzzle) {
      resetPuzzle()
    }
  }, [showPuzzle])

  const resetPuzzle = () => {
    setPiecePosition({ x: 20, y: 50 })
    setIsCompleted(false)
    setIsVerifying(false)
    setShowSuccess(false)
    setFailed(false)
    setCurrentImageIndex(Math.floor(Math.random() * puzzleImages.length))
  }

  const handleShowOffer = () => {
    setShowPuzzle(true)
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

    const constrainedX = Math.max(10, Math.min(90, newX))
    const constrainedY = Math.max(10, Math.min(90, newY))

    setPiecePosition({ x: constrainedX, y: constrainedY })
  }

  const handleMouseUp = () => {
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

  if (!isOpen) return null

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

  // Show initial offer popup
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="bg-white rounded-xl w-full max-w-md mx-auto p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          {/* Store Logo */}
          <div className="w-20 h-12 md:w-24 md:h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-200 p-2">
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

          {/* Main Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Såg du detta erbjudande än?</h2>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6 text-sm">Kunder har nyligen tagit detta erbjudande — missa inte!</p>

          {/* Current Offer */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aktuellt erbjudande:</h3>
            <p className="text-blue-700 font-semibold text-base mb-2">{offer.title}</p>
            <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
            <p className="text-green-700 font-medium text-sm">Rabatten tillämpas automatiskt vid kassan.</p>
          </div>

          {/* Use Discount Button */}
          <button
            onClick={handleShowOffer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-base mb-4"
          >
            Använd rabatt
          </button>

          {/* Cute Character Illustration */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎉</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
