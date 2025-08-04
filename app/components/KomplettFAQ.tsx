"use client"

import { useState } from "react"

const faqData = [
  {
    question: "Hur använder jag Komplett rabattkoder?",
    answer:
      "De flesta av våra Komplett-erbjudanden kräver ingen rabattkod. Klicka bara på 'Använd rabatt' så omdirigeras du till Komplett där rabatten automatiskt tillämpas. För koder som kräver en kupongkod visas denna tydligt och du anger den vid kassan.",
  },
  {
    question: "Varför fungerar inte min Komplett rabattkod?",
    answer:
      "Det kan finnas flera anledningar: koden kan ha gått ut, vara begränsad till specifika produkter, ha ett minimiköpvärde, eller redan ha använts om det finns en begränsning per kund. Kontrollera alltid villkoren för erbjudandet.",
  },
  {
    question: "Kan jag kombinera flera Komplett rabattkoder?",
    answer:
      "Vanligtvis kan du bara använda en rabattkod per beställning hos Komplett. Vissa erbjudanden kan dock kombineras med medlemsrabatter eller andra kampanjer. Läs villkoren för varje erbjudande.",
  },
  {
    question: "Hur ofta uppdateras Komplett rabattkoderna?",
    answer:
      "Vi uppdaterar våra Komplett-erbjudanden dagligen. Nya kampanjer och rabattkoder läggs till så snart de blir tillgängliga, och utgångna erbjudanden tas bort för att säkerställa att du alltid ser aktuella deals.",
  },
  {
    question: "Gäller rabattkoderna på alla Komplett produkter?",
    answer:
      "Det varierar beroende på erbjudandet. Vissa rabattkoder gäller på hela sortimentet, medan andra är begränsade till specifika kategorier som datorer, komponenter eller tillbehör. Villkoren för varje erbjudande specificerar vad som ingår.",
  },
  {
    question: "Kan jag använda Komplett rabattkoder i butik?",
    answer:
      "De flesta av våra rabattkoder är avsedda för Kompletts webbshop. För erbjudanden som även gäller i fysiska butiker anges detta tydligt i villkoren. Kontakta Komplett direkt för information om butiksspecifika erbjudanden.",
  },
]

export default function KomplettFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  return (
    <section className="mt-8 md:mt-12">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Vanliga frågor om Komplett rabattkoder</h2>
        <p className="text-gray-600">Få svar på de mest ställda frågorna om Komplett erbjudanden och rabattkoder</p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openItems.includes(index) ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openItems.includes(index) && (
              <div className="px-6 pb-4">
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
