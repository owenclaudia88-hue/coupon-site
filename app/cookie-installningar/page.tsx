"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronRight } from "lucide-react"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

export default function CookieSettingsPage() {
  const [settings, setSettings] = useState({
    necessary: true, // Always enabled
    functional: true,
    analytics: false,
    marketing: false,
  })

  const handleToggle = (type: keyof typeof settings) => {
    if (type === "necessary") return // Can't disable necessary cookies

    setSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleSaveSettings = () => {
    // Here you would typically save to localStorage or send to server
    localStorage.setItem("cookieSettings", JSON.stringify(settings))
    alert("Dina cookie-inställningar har sparats!")
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setSettings(allAccepted)
    localStorage.setItem("cookieSettings", JSON.stringify(allAccepted))
    alert("Alla cookies har accepterats!")
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    setSettings(onlyNecessary)
    localStorage.setItem("cookieSettings", JSON.stringify(onlyNecessary))
    alert("Endast nödvändiga cookies är aktiverade!")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900">Cookie</span>
              <span className="text-green-600">inställningar</span>
            </h1>
            <p className="text-gray-600 text-lg">Hantera dina cookie-preferenser för Discount Nation</p>
          </div>

          {/* Content */}
          <div className="max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Om cookies</h3>
              <p className="text-blue-800 text-sm">
                Vi använder cookies för att förbättra din upplevelse på vår webbplats. Du kan välja vilka typer av
                cookies du vill acceptera nedan.
              </p>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-6 mb-8">
              {/* Necessary Cookies */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Nödvändiga cookies</h3>
                    <p className="text-gray-600 text-sm">Krävs för att webbplatsen ska fungera</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Alltid aktiverad</span>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av. De ställs
                  vanligtvis in som svar på åtgärder som du gör.
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Funktionella cookies</h3>
                    <p className="text-gray-600 text-sm">Förbättrar webbplatsens funktionalitet</p>
                  </div>
                  <button
                    onClick={() => handleToggle("functional")}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.functional ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings.functional ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
                <p className="text-gray-700 text-sm">
                  Dessa cookies gör det möjligt för webbplatsen att komma ihåg val du gör och ge förbättrade funktioner.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Analytiska cookies</h3>
                    <p className="text-gray-600 text-sm">Hjälper oss förstå hur webbplatsen används</p>
                  </div>
                  <button
                    onClick={() => handleToggle("analytics")}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.analytics ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings.analytics ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
                <p className="text-gray-700 text-sm">
                  Dessa cookies hjälper oss att förstå hur besökare interagerar med webbplatsen genom att samla
                  information anonymt.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Marknadsföringscookies</h3>
                    <p className="text-gray-600 text-sm">Används för riktad marknadsföring</p>
                  </div>
                  <button
                    onClick={() => handleToggle("marketing")}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.marketing ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings.marketing ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
                <p className="text-gray-700 text-sm">
                  Dessa cookies används för att visa annonser som är mer relevanta för dig och dina intressen.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleAcceptAll}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Acceptera alla
              </button>
              <button
                onClick={handleSaveSettings}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Spara inställningar
              </button>
              <button
                onClick={handleRejectAll}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Avvisa alla
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Viktigt att veta</h3>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Du kan ändra dina inställningar när som helst genom att återvända till denna sida</li>
                <li>• Vissa funktioner kanske inte fungerar korrekt om du inaktiverar cookies</li>
                <li>• Dina inställningar sparas lokalt i din webbläsare</li>
              </ul>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Frågor om cookies?</h3>
            <p className="text-gray-600 mb-4">Läs vår cookiepolicy eller kontakta oss för mer information.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cookies"
                className="inline-flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Läs cookiepolicy
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/kontakta-oss"
                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Kontakta oss
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
