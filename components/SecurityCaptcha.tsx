"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, RotateCcw } from "lucide-react"

interface SecurityCaptchaProps {
  isOpen: boolean
  onClose: () => void
  redirectUrl?: string
}

const puzzleImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=250&fit=crop",
]

export default function SecurityCaptcha({
  isOpen,
  onClose,
  redirectUrl = "https://www.elgiganten.se",
}: SecurityCaptchaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [piecePosition, setPiecePosition] = useState({ x: 0, y: 0 })
  const [isCompleted, setIsCompleted] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const puzzleRef = useRef<HTMLDivElement>(null)
  const pieceRef = useRef<HTMLDivElement>(null)

  // Target position (where the piece should go)
  const targetPosition = { x: 60, y: 50 } // 60% from left, 50% from top

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPiecePosition({ x: 20, y: 50 }) // Start position (20% from left, 50% from top)
      setIsCompleted(false)
      setIsVerifying(false)
      setFadeOut(false)
      setCurrentImageIndex(Math.floor(Math.random() * puzzleImages.length))
    }
  }, [isOpen])

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
    if (!isDragging || !puzzleRef.current || isCompleted) return

    const puzzleRect = puzzleRef.current.getBoundingClientRect()
    const newX = ((e.clientX - puzzleRect.left - dragOffset.x) / puzzleRect.width) * 100
    const newY = ((e.clientY - puzzleRect.top - dragOffset.y) / puzzleRect.height) * 100

    // Constrain within puzzle bounds
    const constrainedX = Math.max(10, Math.min(90, newX))
    const constrainedY = Math.max(10, Math.min(90, newY))

    setPiecePosition({ x: constrainedX, y: constrainedY })

    // Check if piece is close to target (within 15% tolerance)
    const distanceX = Math.abs(constrainedX - targetPosition.x)
    const distanceY = Math.abs(constrainedY - targetPosition.y)

    if (distanceX < 15 && distanceY < 15) {
      setIsDragging(false)
      setIsVerifying(true)
      setPiecePosition(targetPosition) // Snap to exact position

      // Simulate verification process
      setTimeout(() => {
        setIsCompleted(true)
        setIsVerifying(false)

        // Start fade out and redirect after success message
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => {
            window.open(redirectUrl, "_blank")
            onClose()
          }, 500)
        }, 1500)
      }, 1500)
    }
  }

  const handleMouseUp = () => {
    if (!isCompleted && !isVerifying) {
      // If not close enough to target, return to start position
      const distanceX = Math.abs(piecePosition.x - targetPosition.x)
      const distanceY = Math.abs(piecePosition.y - targetPosition.y)

      if (distanceX >= 15 || distanceY >= 15) {
        setPiecePosition({ x: 20, y: 50 })
      }
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
    if (!isDragging || !puzzleRef.current || isCompleted) return

    const puzzleRect = puzzleRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const newX = ((touch.clientX - puzzleRect.left - dragOffset.x) / puzzleRect.width) * 100
    const newY = ((touch.clientY - puzzleRect.top - dragOffset.y) / puzzleRect.height) * 100

    const constrainedX = Math.max(10, Math.min(90, newX))
    const constrainedY = Math.max(10, Math.min(90, newY))

    setPiecePosition({ x: constrainedX, y: constrainedY })

    const distanceX = Math.abs(constrainedX - targetPosition.x)
    const distanceY = Math.abs(constrainedY - targetPosition.y)

    if (distanceX < 15 && distanceY < 15) {
      setIsDragging(false)
      setIsVerifying(true)
      setPiecePosition(targetPosition)

      setTimeout(() => {
        setIsCompleted(true)
        setIsVerifying(false)

        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => {
            window.open(redirectUrl, "_blank")
            onClose()
          }, 500)
        }, 1500)
      }, 1500)
    }
  }

  const handleTouchEnd = () => {
    if (!isCompleted && !isVerifying) {
      const distanceX = Math.abs(piecePosition.x - targetPosition.x)
      const distanceY = Math.abs(piecePosition.y - targetPosition.y)

      if (distanceX >= 15 || distanceY >= 15) {
        setPiecePosition({ x: 20, y: 50 })
      }
    }
    setIsDragging(false)
  }

  const resetPuzzle = () => {
    setPiecePosition({ x: 20, y: 50 })
    setIsCompleted(false)
    setIsVerifying(false)
    setCurrentImageIndex(Math.floor(Math.random() * puzzleImages.length))
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="captcha-title"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`bg-white rounded-xl max-w-md w-full p-6 relative shadow-2xl transform transition-all duration-300 ${
          fadeOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Stäng"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 id="captcha-title" className="text-2xl font-bold text-gray-900 mb-2">
            Säkerhetsverifiering
          </h2>
          <p className="text-gray-600">Dra pusselbiten till rätt plats</p>
        </div>

        {/* Puzzle Container */}
        <div ref={puzzleRef} className="relative w-full h-48 mb-6 rounded-lg overflow-hidden bg-gray-100 select-none">
          {/* Background Image */}
          <img
            src={puzzleImages[currentImageIndex] || "/placeholder.svg"}
            alt="Pusselbilder för verifiering"
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Target hole (where piece should go) */}
          <div
            className="absolute w-20 h-20 rounded-full border-3 border-dashed border-gray-400 bg-white bg-opacity-70"
            style={{
              left: `${targetPosition.x}%`,
              top: `${targetPosition.y}%`,
              transform: "translate(-50%, -50%)",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
            }}
          />

          {/* Draggable puzzle piece */}
          <div
            ref={pieceRef}
            className={`absolute w-20 h-20 rounded-full cursor-move transition-all duration-200 ${
              isDragging ? "scale-110 z-20" : "scale-100 z-10"
            } ${isVerifying ? "animate-pulse" : ""}`}
            style={{
              left: `${piecePosition.x}%`,
              top: `${piecePosition.y}%`,
              transform: "translate(-50%, -50%)",
              background: `url(${puzzleImages[currentImageIndex]}) center/cover`,
              backgroundPosition: `${targetPosition.x}% ${targetPosition.y}%`,
              border: isCompleted ? "3px solid #10b981" : isVerifying ? "3px solid #3b82f6" : "3px solid white",
              boxShadow: isDragging ? "0 10px 25px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.2)",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="button"
            aria-label="Dra pusselbiten till rätt plats"
            tabIndex={0}
          >
            {/* Success checkmark */}
            {isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-90 rounded-full">
                <span className="text-white font-bold text-2xl">✓</span>
              </div>
            )}

            {/* Loading spinner */}
            {isVerifying && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-90 rounded-full">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            {isCompleted
              ? "Perfekt! Omdirigerar..."
              : isVerifying
                ? "Verifierar..."
                : "Dra den runda pusselbiten till den streckade cirkeln"}
          </p>
        </div>

        {/* Status messages */}
        {isVerifying && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
              Verifierar...
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-800 rounded-lg border border-green-200">
              <span className="mr-2 text-green-600">✓</span>
              Verifierad! Omdirigerar...
            </div>
          </div>
        )}

        {/* New puzzle button */}
        <div className="flex justify-center">
          <button
            onClick={resetPuzzle}
            disabled={isVerifying || isCompleted}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nytt pussel</span>
          </button>
        </div>
      </div>
    </div>
  )
}
