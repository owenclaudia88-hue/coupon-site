"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: any
  }
}

function getTargetLanguage(pathname: string): string | null {
  // If on a Yamada page, always translate to Japanese
  if (pathname.startsWith("/yamada")) return "ja"

  // Otherwise, detect from browser language
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language || (navigator as any).userLanguage || ""
    const langCode = browserLang.split("-")[0].toLowerCase()

    // If the browser language is Japanese, auto-translate
    if (langCode === "ja") return "ja"
  }

  return null
}

export default function GoogleTranslate() {
  const pathname = usePathname()

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

    const targetLang = getTargetLanguage(pathname)

    if (targetLang) {
      const attemptAutoTranslate = () => {
        const selectEl = document.querySelector<HTMLSelectElement>(".goog-te-combo")
        if (selectEl) {
          selectEl.value = targetLang
          selectEl.dispatchEvent(new Event("change"))
          return true
        }
        return false
      }

      let attempts = 0
      const interval = setInterval(() => {
        if (attemptAutoTranslate() || attempts > 20) {
          clearInterval(interval)
        }
        attempts++
      }, 500)

      return () => clearInterval(interval)
    }
  }, [pathname])

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
