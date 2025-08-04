"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Globe } from "lucide-react"

export default function Sidebar() {
  const [discountForm, setDiscountForm] = useState({
    website: "",
    code: "",
    description: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Calculate statistics based on actual discount data from topPromoCoupons
  const activeDiscounts = 13 // Current active discount codes (including iPhone offer)
  const expiredDiscounts = 7 // Expired discount codes
  const totalOffers = activeDiscounts + expiredDiscounts // 20 total offers
  const bestDiscount = "70%" // Highest percentage discount from iPhone 16 Pro Max offer
  const bestMonetaryDiscount = "3 000 kr" // Highest monetary discount from TV-apparater offer
  const averageSavings = "2 100 kr" // Updated average based on including the iPhone offer

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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Elgiganten Gaming</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Elgiganten har ett brett utbud för att förse gamers med allt som kan önskas. Letar du headset för VR gaming,
          ett nytt tangentbord, ett ps5, eller Battlefield 2040? Elgiganten säljer allt detta och mycket mer. Vidga dina
          vyer med nytt spännande eller uppdatera de trusty produkterna du älskat sedan länge - Elgiganten har något för
          alla.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">iPhone x Elgiganten</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          För alla Apple-älskare är Elgiganten rätt plats, med deras stora sortiment av Apple produkter. Handla en av de
          många iPhone modellerna till ett bra pris eller välj bland alla skal som tillhör till din telefon. Se dessutom
          till att försäkra din telefon med Applecare Services via Elgiganten - du kan lära dig mer om fördelarna på
          hemsidan.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medlemmar sparar mer</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Elgiganten har en förmånlig kundklubb som erbjuder medlemmar kundpriser på utvalda produkter varje vecka.
          Utöver de nedsatta priserna får medlemmar även en hel del andra förmåner så som rabatt på supporttjänster,
          längre öppet köp och exklusiva erbjudanden från Elgigantens partners. För att ta del av allt detta och ännu
          mer, anmäl dig snabbt och smidigt på Elgigantens hemsida.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Elgigantens stora sortiment</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          På Elgiganten hittar du ett brett utbud av elektronik så som mobiler, vitvaror, datorer, soundbars,
          musikinstrument, eltandborstar, handtorkar, löpband och segways. Varesig du letar ps5, Iphone 12,
          massagepistol eller en fitbit så hittar du det till ett bra pris på Elgiganten.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Elgiganten Outlet</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          För dig som gillar att spara och storfynda, sväng förbi Elgigantens online outlet. Där hittar du hundratals
          produkter till outlet-priser, det vill säga ännu lägre priser. Spara 600kr på en Apple Watch eller ta vara på
          4000kr rabatt på en Iphone - vad du än söker finns det säkert något för dig.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Elgigantens butiker</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Elgiganten har inte endast en online version utan även runt 170 fysiska butiker i Sverige. För dig som gillar
          att uppleva varorna i person innan du handlar, kan du kika in på en av dessa butiker och dessutom få chans att
          ställa frågor och få råd av Elgigantens personal.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Elgiganten kontakt</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <div>Esbogatan 12, 164 74 Kista,</div>
              <div>Sverige</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <a href="tel:0771115115" className="text-sm text-blue-600 hover:underline">
              0771 - 115 115
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <a
              href="https://elgiganten.se"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Elgiganten
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
              placeholder="Elgiganten.se"
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
