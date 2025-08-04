"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Finns det en fungerande Elgiganten rabattkod tillgänglig?",
    answer:
      "För närvarande finns det 12 rabattkoder tillgängliga för Elgiganten på Discount Nation. Dessa rabattkoder används av tusentals kunder och blev senast verifierade den 3 augusti 2025.",
  },
  {
    question: "Hur mycket pengar kan jag spara på Elgiganten?",
    answer:
      "De senaste 30 dagarna har våra besökare sparat upp till 11 000 kr hos Elgiganten med våra 12 olika rabattkoder och erbjudanden.",
  },
  {
    question: "Hur hittar jag de bästa rabattkoderna för Elgiganten?",
    answer:
      "Du kan prova våra 12 rabattkoder för att se vilken rabattkod du sparar mest med, eller direkt välja den rabattkod som Discount Nation rekommenderar. På vår sida hittar du alltid de senaste Elgiganten rabattkoderna så att du inte går miste om något erbjudande.",
  },
  {
    question: "Erbjuder Elgiganten en studentrabatt?",
    answer:
      "Ja, Elgiganten erbjuder studenter 20% rabatt på utvalda produkter. För att ta del av denna rabattkod behöver du först verifiera din studentstatus. Med Elgigantens konkurrenskraftiga priser och denna förmånliga studentrabatt passar Elgiganten perfekt för studenter.",
  },
  {
    question: "Hur lång garanti har Elgiganten?",
    answer:
      "Elgiganten erbjuder alltid sina kunder garantin att returnera en produkt inom 3 år. Det kan även vara så att leverantören har ytterligare garantier. För att se vad som gäller för den produkt du är intresserad av kan du kolla i produktinformationen eller instruktionsboken.",
  },
  {
    question: "Vad är Elgiganten Cloud?",
    answer:
      "Elgiganten Cloud är en tjänst med vilken du kan säkerhetskopiera och lagra, synkronisera och organisera dina filer. Elgiganten erbjuder flera olika abonnemang för dygnet runt-tillgång till din egen molnlagring som tillåter hela familjen att använda samma Cloud-konto.",
  },
  {
    question: "Hur många Elgiganten butiker finns det i Sverige?",
    answer:
      "I Sverige finns det ungefär 70 Elgiganten butiker och Elgiganten Phone House butiker totalt. Du hittar dessa butiker bland annat i Borlänge, Örebro, Kungälv, Kiruna, Skellefteå, Skövde, Kungsbacka, Backaplan, Högsbo, Bäckebol, och Nordstan.",
  },
  {
    question: "Hur kan jag kontakta Elgiganten?",
    answer:
      "Om du önskar kontakta Elgiganten för att ställa frågor eller andra ärenden, så kan du antingen ringa dem eller kontakta dem via e-post. Deras telefonnummer (0771-15 15 15) är öppet på vardagar 8:00-20:00. Deras e-postadress är: hello@elgiganten.se för allmänna frågor.",
  },
  {
    question: "Vad är Elgiganten Phone House?",
    answer:
      "Elgiganten Phone House är butiker inriktade på mobil kommunikation. De säljer produkter från flera stora operatörer så som Tele2, Tre, Apple, Sony, Samsung, Huawei, m.fl. Telefoner, LTE och 5G. Elgiganten Phone House finns i åtta olika länder och har över 2400 butiker.",
  },
  {
    question: "Vad är Elgiganten Megastore?",
    answer:
      "Elgiganten Megastore är ett butikskoncept som innehåller större butiker än de klassiska Elgiganten butikerna, med mer produkter och mer plats. Elgiganten Megastore har dessutom ett större sortiment i butiken av både traditionella produkter och specialvaror från Elgigantens sortiment.",
  },
  {
    question: "Erbjuder Elgiganten en medlemsrabatt?",
    answer:
      "Ja, Elgiganten erbjuder sina kunder som är med i kundklubben nya rabatter varje vecka. Som medlem erbjuds du alltid rabatt på utvalda produkter, och får ta del av flera förmåner och erbjudanden från Elgigantens partners. Medlemskap är dessutom alltid gratis så du behöver bara registrera dig.",
  },
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Vanliga frågor på Elgiganten (FAQ)</h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 pr-4">{item.question}</h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </div>
            </button>
            {openItems.includes(index) && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
