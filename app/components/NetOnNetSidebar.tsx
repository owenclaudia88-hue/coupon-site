"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Globe } from "lucide-react"

export default function NetOnNetSidebar() {
  const [discountForm, setDiscountForm] = useState({
    website: "",
    code: "",
    description: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Calculate statistics based on NetOnNet discount data
  const activeDiscounts = 12 // Current active discount codes
  const expiredDiscounts = 5 // Expired discount codes
  const totalOffers = activeDiscounts + expiredDiscounts // 17 total offers
  const bestDiscount = "50%" // Highest percentage discount
  const bestMonetaryDiscount = "2 500 kr" // Highest monetary discount
  const averageSavings = "1 800 kr" // Average savings

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Reset form after 3 seconds and show thank you message
    setTimeout(() => {
      setDiscountForm({ website: "", code: "", description: "" })
      setIsSubmitted(false)
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDiscountForm({
      ...discountForm,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kupongöversikt</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Bästa rabatt:</span>
            <span className="font-semibold text-green-600">{bestDiscount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Högsta besparing:</span>
            <span className="font-semibold text-green-600">{bestMonetaryDiscount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rabattkoder:</span>
            <span className="font-semibold">{activeDiscounts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Totala erbjudanden:</span>
            <span className="font-semibold">{totalOffers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Genomsnittlig besparing:</span>
            <span className="font-semibold text-green-600">{averageSavings}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NetOnNet Gaming</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          NetOnNet har ett omfattande sortiment för gamers med allt från gaming-datorer och konsoler till headsets och
          gaming-tillbehör. Hitta de senaste produkterna från PlayStation, Xbox, Nintendo och PC-gaming till
          konkurrenskraftiga priser med snabb leverans.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NetOnNet Datorer</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Hos NetOnNet hittar du ett stort urval av datorer för alla behov. Från kraftfulla gaming-riggar till bärbara
          datorer för studier och arbete. Välj mellan märken som HP, Dell, Lenovo, ASUS och många fler till fantastiska
          priser.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NetOnNet Mobiltelefoner</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          NetOnNet erbjuder de senaste smartphones från Apple, Samsung, Google och andra ledande märken. Hitta iPhone
          15, Samsung Galaxy S24, och andra toppmodeller till bra priser med möjlighet till avbetalning och försäkring.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NetOnNet TV & Ljud</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Upptäck NetOnNets stora sortiment av TV-apparater, soundbars och ljudsystem. Från Samsung QLED och LG OLED
          till Sony Bravia - alla storlekar och tekniker finns tillgängliga med professionell installation och support.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NetOnNet Click & Collect</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Med NetOnNets Click & Collect kan du beställa online och hämta i butik samma dag. Beställ före 15:00 så är din
          vara redo för upphämtning. Perfekt när du vill vara säker på att produkten finns tillgänglig.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NetOnNet kontakt</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <div>NetOnNet AB, Box 1206,</div>
              <div>164 28 Kista, Sverige</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <a href="tel:0771400400" className="text-sm text-blue-600 hover:underline">
              0771 - 400 400
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <a
              href="https://netonnet.se"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              NetOnNet
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dela en rabattkod</h3>
        <p className="text-sm text-gray-600 mb-4">
          Dela en rabattkod eller ett erbjudande som vi missat, och hjälp andra spara pengar!
        </p>

        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-green-600 font-semibold mb-2">Tack för ditt bidrag!</div>
            <p className="text-sm text-green-700">
              Vi kommer att granska din rabattkod och lägga till den om den är giltig.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="website"
              value={discountForm.website}
              onChange={handleInputChange}
              placeholder="NetOnNet.se"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              name="code"
              value={discountForm.code}
              onChange={handleInputChange}
              placeholder="Rabattkod"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <textarea
              name="description"
              value={discountForm.description}
              onChange={handleInputChange}
              placeholder="Beskrivning"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
            >
              Ange kod
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
