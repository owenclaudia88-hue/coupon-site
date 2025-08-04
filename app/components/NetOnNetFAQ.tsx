"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Finns det en fungerande NetOnNet rabattkod tillgänglig?",
    answer:
      "För närvarande finns det 12 rabattkoder tillgängliga för NetOnNet på Discount Nation. Dessa rabattkoder används av tusentals kunder och blev senast verifierade den 3 augusti 2025.",
  },
  {
    question: "Hur mycket pengar kan jag spara på NetOnNet?",
    answer:
      "De senaste 30 dagarna har våra besökare sparat upp till 8 500 kr hos NetOnNet med våra 12 olika rabattkoder och erbjudanden.",
  },
  {
    question: "Hur hittar jag de bästa rabattkoderna för NetOnNet?",
    answer:
      "Du kan prova våra 12 rabattkoder för att se vilken rabattkod du sparar mest med, eller direkt välja den rabattkod som Discount Nation rekommenderar. På vår sida hittar du alltid de senaste NetOnNet rabattkoderna.",
  },
  {
    question: "Erbjuder NetOnNet en studentrabatt?",
    answer:
      "Ja, NetOnNet erbjuder studenter 15% rabatt på utvalda produkter. För att ta del av denna rabattkod behöver du först verifiera din studentstatus genom deras studentportal.",
  },
  {
    question: "Vad är NetOnNets prisgaranti?",
    answer:
      "NetOnNet erbjuder prisgaranti vilket innebär att om du hittar samma produkt billigare hos en konkurrent inom 30 dagar efter köp, så matchar NetOnNet priset och ger dig mellanskillnaden tillbaka.",
  },
  {
    question: "Hur fungerar NetOnNets Click & Collect?",
    answer:
      "Med Click & Collect kan du beställa online och hämta i butik samma dag. Beställ före kl 15:00 så är din vara redo för upphämtning samma dag i vald NetOnNet-butik.",
  },
  {
    question: "Hur många NetOnNet butiker finns det i Sverige?",
    answer:
      "I Sverige finns det över 200 NetOnNet butiker spridda över hela landet. Du hittar butiker i alla större städer samt många mindre orter, från Malmö i söder till Kiruna i norr.",
  },
  {
    question: "Hur kan jag kontakta NetOnNet?",
    answer:
      "Du kan kontakta NetOnNet via telefon 0771-400 400 (vardagar 8-20, helger 10-18), via e-post på kundservice@netonnet.se, eller genom deras livechatt på hemsidan.",
  },
  {
    question: "Vad är NetOnNet Business?",
    answer:
      "NetOnNet Business är deras företagslösning som erbjuder specialpriser, fakturering, och dedikerad kundservice för företag och organisationer. Perfekt för IT-inköp till kontoret.",
  },
  {
    question: "Vilka leveransalternativ erbjuder NetOnNet?",
    answer:
      "NetOnNet erbjuder hemleverans, leverans till utlämningsställe, och upphämtning i butik. Fri frakt på beställningar över 399 kr. Express-leverans finns tillgänglig för brådskande köp.",
  },
  {
    question: "Har NetOnNet en medlemsklubb?",
    answer:
      "Ja, NetOnNet har en kostnadsfri medlemsklubb som ger dig tillgång till exklusiva erbjudanden, förlängd returrätt, och personliga rekommendationer baserat på dina intressen.",
  },
]

export default function NetOnNetFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Vanliga frågor på NetOnNet (FAQ)</h2>
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
