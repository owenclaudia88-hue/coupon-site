"use client"

import { useEffect } from "react"
import Script from "next/script"

interface GoogleTranslateProps {
  autoTranslateTo?: string
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: any
  }
}

export default function GoogleTranslate({ autoTranslateTo }: GoogleTranslateProps) {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "sv",
            includedLanguages: "ja,sv,en,de,fr,es,zh-CN,ko",
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            autoDisplay: false,
          },
          "google_translate_element"
        )
      }
    }

    // If autoTranslateTo is set, auto-switch language after widget loads
    if (autoTranslateTo) {
      const attemptAutoTranslate = () => {
        const selectEl = document.querySelector<HTMLSelectElement>(".goog-te-combo")
        if (selectEl) {
          selectEl.value = autoTranslateTo
          selectEl.dispatchEvent(new Event("change"))
          return true
        }
        return false
      }

      // Retry a few times since the widget loads asynchronously
      let attempts = 0
      const interval = setInterval(() => {
        if (attemptAutoTranslate() || attempts > 20) {
          clearInterval(interval)
        }
        attempts++
      }, 500)

      return () => clearInterval(interval)
    }
  }, [autoTranslateTo])

  return (
    <>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div
        id="google_translate_element"
        className="fixed bottom-4 right-4 z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
        style={{ minWidth: "auto" }}
      />
      {/* Hide the Google Translate top bar that shifts the page */}
      <style jsx global>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }
        #google_translate_element .skiptranslate { display: block !important; }
        #google_translate_element { font-size: 0; }
        #google_translate_element select { font-size: 14px; }
      `}</style>
    </>
  )
}
