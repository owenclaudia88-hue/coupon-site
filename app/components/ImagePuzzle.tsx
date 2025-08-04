"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, RotateCcw } from "lucide-react"

interface ImagePuzzleProps {
  onComplete: () => void
  onClose: () => void
}

export default function ImagePuzzle({ onComplete, onClose }: ImagePuzzleProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [piecePosition, setPiecePosition] = useState({ x: 50, y: 50 })
  const [isCompleted, setIsCompleted] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const puzzleRef = useRef<HTMLDivElement>(null)

  // Target position where the piece should be placed (center-right of the image)
  const targetPosition = { x: 280, y: 100 }
  const tolerance = 30

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !puzzleRef.current) return

    const rect = puzzleRef.current.getBoundingClientRect()
    const newX = Math.max(0, Math.min(e.clientX - rect.left - 30, rect.width - 60))
    const newY = Math.max(0, Math.min(e.clientY - rect.top - 30, rect.height - 60))

    setPiecePosition({ x: newX, y: newY })

    // Check if piece is close to target position
    const distance = Math.sqrt(Math.pow(newX - targetPosition.x, 2) + Math.pow(newY - targetPosition.y, 2))

    if (distance < tolerance && !isCompleted) {
      setPiecePosition({ x: targetPosition.x, y: targetPosition.y })
      setIsDragging(false)
      setIsVerifying(true)

      setTimeout(() => {
        setIsCompleted(true)
        setIsVerifying(false)
        setTimeout(() => {
          onComplete()
        }, 1500)
      }, 2000)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetPuzzle = () => {
    setPiecePosition({ x: 50, y: 50 })
    setIsCompleted(false)
    setIsVerifying(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Security Verification</h2>
          <p className="text-gray-600">Please complete the puzzle to continue</p>
        </div>

        {/* Puzzle Container */}
        <div
          ref={puzzleRef}
          className="relative w-full h-48 mb-6 rounded-lg overflow-hidden cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Main puzzle image */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZVevZAQzAi7VSDd9Lj6lLJOrXmANen.png"
            alt="Puzzle"
            className="w-full h-full object-cover"
          />

          {/* Draggable puzzle piece */}
          <div
            className={`absolute w-16 h-16 rounded-full border-4 border-white cursor-move transition-all duration-200 overflow-hidden ${
              isDragging ? "scale-110 shadow-lg z-10" : ""
            } ${isCompleted ? "border-green-500" : ""}`}
            style={{
              left: `${piecePosition.x}px`,
              top: `${piecePosition.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={handleMouseDown}
          >
            {isCompleted ? (
              <div className="w-full h-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
            ) : (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZVevZAQzAi7VSDd9Lj6lLJOrXmANen.png"
                alt="Puzzle piece"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: "75% 50%",
                }}
              />
            )}
          </div>
        </div>

        {/* Only show "New puzzle" link, remove all verification text */}
        <div className="flex justify-center">
          <button
            onClick={resetPuzzle}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            disabled={isVerifying || isCompleted}
          >
            <RotateCcw className="w-4 h-4" />
            <span>New puzzle</span>
          </button>
        </div>
      </div>
    </div>
  )
}
