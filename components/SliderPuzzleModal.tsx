"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, RotateCcw } from "lucide-react"

interface SliderPuzzleModalProps {
  isOpen: boolean
  onClose: () => void
}

const puzzleImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=500&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop&crop=center",
]

export default function SliderPuzzleModal({ isOpen, onClose }: SliderPuzzleModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [piecePosition, setPiecePosition] = useState(50)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const pieceRef = useRef<HTMLDivElement>(null)

  // Target position for the missing piece (center-right area)
  const targetPosition = 320
  const tolerance = 25

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetPuzzle()
    }
  }, [isOpen])

  const resetPuzzle = () => {
    setPiecePosition(50)
    setIsCompleted(false)
    setIsVerifying(false)
    setShowSuccess(false)
    setFailed(false)
    setCurrentImageIndex(Math.floor(Math.random() * puzzleImages.length))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCompleted || isVerifying) return
    setIsDragging(true)
    setFailed(false)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || isCompleted) return

    const rect = containerRef.current.getBoundingClientRect()
    const imageWidth = rect.width
    const newPosition = Math.max(25, Math.min(e.clientX - rect.left, imageWidth - 25))

    setPiecePosition(newPosition)

    // Check if piece is close to target position
    const distance = Math.abs(newPosition - targetPosition)

    if (distance < tolerance) {
      setIsDragging(false)
      setPiecePosition(targetPosition)
      setIsVerifying(true)

      // Simulate verification process
      setTimeout(() => {
        setIsCompleted(true)
        setIsVerifying(false)
        setShowSuccess(true)

        // Redirect after success animation
        setTimeout(() => {
          // Hidden redirect URL - only revealed after successful verification
          const redirectUrl = "https://www.elgiganten.se"
          window.open(redirectUrl, "_blank")
          onClose()
        }, 2000)
      }, 1500)
    }
  }

  const handleMouseUp = () => {
    if (!isCompleted && !isVerifying && isDragging) {
      // Check if user released too far from target
      const distance = Math.abs(piecePosition - targetPosition)
      if (distance > tolerance) {
        setFailed(true)
        setTimeout(() => {
          setPiecePosition(50)
          setFailed(false)
        }, 1000)
      }
    }
    setIsDragging(false)
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isCompleted || isVerifying) return
    setIsDragging(true)
    setFailed(false)
    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current || isCompleted) return

    const rect = containerRef.current.getBoundingClientRect()
    const imageWidth = rect.width
    const touch = e.touches[0]
    const newPosition = Math.max(25, Math.min(touch.clientX - rect.left, imageWidth - 25))

    setPiecePosition(newPosition)

    const distance = Math.abs(newPosition - targetPosition)

    if (distance < tolerance) {
      setIsDragging(false)
      setPiecePosition(targetPosition)
      setIsVerifying(true)

      setTimeout(() => {
        setIsCompleted(true)
        setIsVerifying(false)
        setShowSuccess(true)

        setTimeout(() => {
          const redirectUrl = "https://www.elgiganten.se"
          window.open(redirectUrl, "_blank")
          onClose()
        }, 2000)
      }, 1500)
    }
  }

  const handleTouchEnd = () => {
    if (!isCompleted && !isVerifying && isDragging) {
      const distance = Math.abs(piecePosition - targetPosition)
      if (distance > tolerance) {
        setFailed(true)
        setTimeout(() => {
          setPiecePosition(50)
          setFailed(false)
        }, 1000)
      }
    }
    setIsDragging(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full mx-auto shadow-2xl">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Stäng"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Säkerhetsverifiering</h2>
            <p className="text-gray-600">Vänligen slutför pusslet för att fortsätta</p>
          </div>
        </div>

        {/* Puzzle Image Container */}
        <div className="px-6 pb-6">
          <div
            ref={containerRef}
            className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 cursor-crosshair select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Image */}
            <img
              src={puzzleImages[currentImageIndex] || "/placeholder.svg"}
              alt="Pusselbilder"
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Missing piece cutout (white circle) */}
            <div
              className="absolute w-16 h-16 bg-white rounded-full border-2 border-dashed border-gray-300"
              style={{
                left: `${targetPosition}px`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Draggable puzzle piece */}
            <div
              ref={pieceRef}
              className={`absolute w-16 h-16 rounded-full border-4 cursor-move transition-all duration-200 overflow-hidden ${
                isDragging ? "scale-110 shadow-xl z-10" : "shadow-lg"
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
                left: `${piecePosition}px`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {isCompleted && showSuccess ? (
                <div className="w-full h-full bg-green-500 flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-2xl">✓</span>
                </div>
              ) : isVerifying ? (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : failed ? (
                <div className="w-full h-full bg-red-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✗</span>
                </div>
              ) : (
                <img
                  src={puzzleImages[currentImageIndex] || "/placeholder.svg"}
                  alt="Pusselbit"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${((targetPosition - 32) / (containerRef.current?.offsetWidth || 400)) * 100}% 50%`,
                  }}
                  draggable={false}
                />
              )}
            </div>
          </div>

          {/* Slider Track */}
          <div className="mt-6 relative bg-gray-200 rounded-full h-12 overflow-hidden">
            {/* Progress indicator */}
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-300 rounded-full ${
                isCompleted ? "bg-green-500" : isVerifying ? "bg-blue-500" : "bg-gray-400"
              }`}
              style={{
                width: `${Math.min((piecePosition / (containerRef.current?.offsetWidth || 400)) * 100, 100)}%`,
              }}
            />

            {/* Slider text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className={`text-sm font-medium transition-colors ${
                  isCompleted || isVerifying ? "text-white" : "text-gray-600"
                }`}
              >
                {isCompleted && showSuccess
                  ? "Verifierad! Omdirigerar..."
                  : failed
                    ? "Misslyckades, försök igen"
                    : isVerifying
                      ? "Verifierar..."
                      : "Skjut för att slutföra pusslet"}
              </span>
            </div>
          </div>

          {/* Status Messages */}
          {isVerifying && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                Verifierar...
              </div>
            </div>
          )}

          {showSuccess && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-800 rounded-lg border border-green-200">
                <span className="mr-2 text-green-600 text-lg">✓</span>
                Verifierad! Omdirigerar...
              </div>
            </div>
          )}

          {failed && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-800 rounded-lg border border-red-200">
                <span className="mr-2 text-red-600">✗</span>
                Misslyckades, försök igen
              </div>
            </div>
          )}

          {/* New Puzzle Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={resetPuzzle}
              disabled={isVerifying || (isCompleted && showSuccess)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
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
