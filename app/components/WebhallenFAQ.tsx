"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function WebhallenFAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqItems = [
    {
      question: "Hur fungerar Webhallen rabattkoder?",
      answer:
        "Webhallen rabattkoder fungerar genom att du klickar på 'Använd rabatt' på den kod du vill använda. Du omdirigeras då till Webhallen.com där rabatten tillämpas automatiskt på kvalificerade produkter. Vissa erbjudanden kräver inga koder alls - rabatten visas direkt på produktsidan.",
    },
    {
      question: "Kan jag kombinera flera rabattkoder?",
      answer:
        "Nej, vanligtvis kan du bara använda en rabattkod per beställning hos Webhallen. Däremot kan vissa rabatter kombineras med befintliga kampanjer och reavaror på sajten. Studentrabatter kan ofta kombineras med andra erbjudanden.",
    },
    {
      question: "Hur ofta uppdateras Webhallen erbjudandena?",
      answer:
        "Vi uppdaterar Webhallen rabattkoder och erbjudanden dagligen. Webhallen lanserar regelbundet nya kampanjer, särskilt under stora shopping-event som Black Friday, Cyber Monday, och säsongskampanjer. Vi rekommenderar att du besöker denna sida regelbundet för att inte missa de bästa erbjudandena.",
    },
    {
      question: "Vad händer om min rabattkod inte fungerar?",
      answer:
        "Om din Webhallen rabattkod inte fungerar kan det bero på flera saker: koden kan ha gått ut, vara begränsad till vissa produkter, eller redan ha använts maximalt antal gånger. Kontrollera utgångsdatumet och villkoren för erbjudandet. Kontakta Webhallens kundservice om problemet kvarstår.",
    },
    {
      question: "Finns det studentrabatt hos Webhallen?",
      answer:
        "Ja, Webhallen erbjuder regelbundet studentrabatter på upp till 15% på hela sortimentet. För att få studentrabatt behöver du verifiera din studentstatus. Studentrabatter kan ofta kombineras med andra erbjudanden för maximala besparingar på gaming-utrustning.",
    },
    {
      question: "Kan jag returnera produkter köpta med rabattkod?",
      answer:
        "Ja, Webhallens vanliga returpolicy gäller även för produkter köpta med rabattkoder. Du har 30 dagars öppet köp på de flesta produkter. Vid retur får du tillbaka det belopp du faktiskt betalade (efter rabatt). Läs igenom Webhallens fullständiga returvillkor på deras webbplats.",
    },
    {
      question: "Gäller rabattkoderna på alla produkter?",
      answer:
        "Inte alla rabattkoder gäller på hela Webhallens sortiment. Vissa erbjudanden är begränsade till specifika kategorier som gaming-datorer, grafikkort eller tillbehör. Läs alltid beskrivningen av rabattkoden för att se vilka produkter som inkluderas i erbjudandet.",
    },
  ]

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
        Vanliga frågor om Webhallen rabattkoder
      </h2>
      <div className="space-y-3 md:space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 md:px-6 py-4 md:py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-sm md:text-base pr-4">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                  openItem === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openItem === index && (
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
