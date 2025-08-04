"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqData = [
  {
    question: "Hur fungerar rabattkoder på CDON?",
    answer:
      "Rabattkoder på CDON tillämpas vanligtvis automatiskt när du handlar kvalificerade produkter. Vissa koder kan kräva att du anger dem vid kassan. Kontrollera alltid villkoren för varje rabattkod.",
  },
  {
    question: "Kan jag kombinera flera rabattkoder?",
    answer:
      "Nej, vanligtvis kan du bara använda en rabattkod per beställning på CDON. Systemet väljer automatiskt den rabatt som ger dig mest fördelar.",
  },
  {
    question: "Varför fungerar inte min rabattkod?",
    answer:
      "Det kan finnas flera anledningar: koden kan ha gått ut, vara begränsad till vissa produkter, ha ett minimiköpbelopp, eller redan ha använts maximalt antal gånger. Kontrollera villkoren för koden.",
  },
  {
    question: "Gäller rabattkoderna för alla säljare på CDON?",
    answer:
      "Nej, rabattkoder gäller vanligtvis bara för produkter som säljs av CDON själva, inte för externa säljare på CDON Marketplace. Detta anges tydligt i villkoren för varje rabattkod.",
  },
  {
    question: "Hur länge gäller CDON rabattkoder?",
    answer:
      "Varje rabattkod har sitt eget utgångsdatum som anges tydligt. Vissa koder gäller bara under begränsade kampanjperioder, medan andra kan gälla längre. Kontrollera alltid utgångsdatumet.",
  },
  {
    question: "Får jag rabatt på redan nedsatta produkter?",
    answer:
      "Det beror på rabattkoden. Vissa koder gäller på alla produkter, medan andra kan vara begränsade till produkter till ordinarie pris. Läs villkoren för varje specifik rabattkod.",
  },
  {
    question: "Vad händer om jag returnerar en vara jag köpt med rabattkod?",
    answer:
      "Vid retur får du tillbaka det belopp du faktiskt betalade (efter rabatt). Rabattkoden kan inte användas igen om den redan är förbrukad eller utgången.",
  },
  {
    question: "Kan jag använda rabattkoder i CDON:s mobilapp?",
    answer:
      "Ja, rabattkoder fungerar både på CDON:s webbplats och i deras mobilapp. Processen är densamma - ange koden vid kassan eller så tillämpas den automatiskt.",
  },
  {
    question: "Finns det studentrabatter på CDON?",
    answer:
      "CDON erbjuder ibland särskilda kampanjer för studenter, särskilt inför terminsstart. Håll utkik efter studentspecifika rabattkoder och erbjudanden på deras webbplats.",
  },
  {
    question: "Hur får jag veta om nya CDON rabattkoder?",
    answer:
      "Prenumerera på CDON:s nyhetsbrev, följ dem på sociala medier, eller besök vår sida regelbundet för de senaste rabattkoderna och erbjudandena.",
  },
]

export default function CDONFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Vanliga frågor om CDON rabattkoder</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {faqData.map((faq, index) => (
          <div key={index} className={`border-b border-gray-200 last:border-b-0`}>
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 md:px-6 py-4 md:py-5 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </div>
            </button>
            {openItems.includes(index) && (
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
