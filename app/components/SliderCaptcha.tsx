"use client"

import type React from "react"

import { useState, useRef } from "react"

interface SliderCaptchaProps {
  onComplete: () => void
}

export default function SliderCaptcha({ onComplete }: SliderCaptchaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(0)
  const [completed, setCompleted] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const newPosition = Math.max(0, Math.min(e.clientX - rect.left - 20, rect.width - 40))
    setPosition(newPosition)

    if (newPosition >= rect.width - 50) {
      setCompleted(true)
      setIsDragging(false)
      setTimeout(() => onComplete(), 500)
    }
  }

  const handleMouseUp = () => {
    if (!completed) {
      setPosition(0)
    }
    setIsDragging(false)
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600 mb-3">Dra för att verifiera att du är människa</p>
      <div
        ref={sliderRef}
        className="relative bg-gray-200 rounded-lg h-12 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-300 ${
            completed ? "w-full" : ""
          }`}
          style={{ width: completed ? "100%" : `${position + 40}px` }}
        />
        <div
          className={`absolute top-1 left-1 w-10 h-10 bg-white rounded-lg shadow-md cursor-pointer flex items-center justify-center transition-all duration-300 ${
            isDragging ? "scale-110" : ""
          } ${completed ? "bg-green-600" : ""}`}
          style={{ left: `${position}px` }}
          onMouseDown={handleMouseDown}
        >
          {completed ? <span className="text-white font-bold">✓</span> : <span className="text-gray-600">→</span>}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`text-sm font-medium ${completed ? "text-white" : "text-gray-600"}`}>
            {completed ? "Verifierad!" : "Dra för att verifiera"}
          </span>
        </div>
      </div>
    </div>
  )
}
