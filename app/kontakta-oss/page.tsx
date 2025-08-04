"use client"

import type React from "react"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setError(data.error || "Ett fel uppstod när meddelandet skulle skickas")
      }
    } catch (err) {
      setError("Ett fel uppstod. Kontrollera din internetanslutning och försök igen.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Tack för ditt meddelande!</h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Vi har tagit emot ditt meddelande och kommer att svara dig inom 24 timmar. Håll utkik i din inkorg för
                vårt svar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Skicka ett till meddelande
                </button>
                <a
                  href="/"
                  className="inline-block bg-gray-100 text-gray-700 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Tillbaka till startsidan
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Kontakta <span className="text-green-600">Oss</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Har du frågor, förslag eller behöver hjälp? Vi finns här för att hjälpa dig. Kontakta oss på det sätt som
            passar dig bäst.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Skicka ett Meddelande</h2>

            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm sm:text-base">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Förnamn *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                    placeholder="Ditt förnamn"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Efternamn *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                    placeholder="Ditt efternamn"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-postadress *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                  placeholder="din@email.se"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Ämne *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                >
                  <option value="">Välj ett ämne</option>
                  <option value="general">Allmän fråga</option>
                  <option value="coupon">Problem med rabattkod</option>
                  <option value="partnership">Partnerskap</option>
                  <option value="technical">Teknisk support</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Meddelande *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                  placeholder="Beskriv ditt ärende eller din fråga..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-base"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Skickar...
                  </>
                ) : (
                  "Skicka Meddelande"
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Kontaktinformation</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">E-post</div>
                    <div className="text-gray-600 text-sm sm:text-base">support@discountnation.se</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Telefon</div>
                    <div className="text-gray-600 text-sm sm:text-base">+44 73 9868 1267</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Adress</div>
                    <div className="text-gray-600 text-sm sm:text-base">
                      AA DISCOUNTS LTD
                      <br />
                      344-348 High Road Ilford
                      <br />
                      England IG1 1QP
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Öppettider</div>
                    <div className="text-gray-600 text-sm sm:text-base">
                      Måndag - Fredag: 09:00 - 17:00
                      <br />
                      Helger: Stängt
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Vanliga Frågor</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start mb-2">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Hur fungerar rabattkoderna?</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed ml-6 sm:ml-7">
                    Klicka på "Visa rabattkod", verifiera att du är människa, och koden kopieras automatiskt. Klistra
                    sedan in koden vid kassan.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start mb-2">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Är alla koder verifierade?</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed ml-6 sm:ml-7">
                    Ja, vi kontrollerar regelbundet att alla våra rabattkoder fungerar och tar bort de som har upphört
                    att gälla.
                  </p>
                </div>

                <div>
                  <div className="flex items-start mb-2">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Kostar det något att använda tjänsten?
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed ml-6 sm:ml-7">
                    Nej, Discount Nation är helt gratis att använda. Vi tjänar pengar genom provisioner från våra
                    partnerbutiker.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
              <div className="flex items-center mb-3 sm:mb-4">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold">Snabb Hjälp</h2>
              </div>
              <p className="mb-4 text-sm sm:text-base leading-relaxed">
                Behöver du omedelbar hjälp? Kontakta oss via e-post så svarar vi inom 24 timmar.
              </p>
              <a
                href="mailto:support@discountnation.se"
                className="inline-block bg-white text-green-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600 text-sm sm:text-base"
              >
                Skicka E-post Nu
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
