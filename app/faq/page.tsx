import type { Metadata } from "next"
import { ChevronDown, ChevronUp } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"

export const metadata: Metadata = {
  title: "FAQ - Vanliga frågor | Discount Nation",
  description:
    "Hitta svar på vanliga frågor om rabattkoder, erbjudanden och hur du använder Discount Nation för att spara pengar.",
}

const faqData = [
  {
    category: "Allmänt",
    questions: [
      {
        question: "Vad är Discount Nation?",
        answer:
          "Discount Nation är Sveriges ledande plattform för rabattkoder och erbjudanden. Vi samlar de bästa dealsen från populära butiker som Elgiganten, Power, NetOnNet, Webhallen, Komplett och CDON på ett ställe.",
      },
      {
        question: "Är det gratis att använda Discount Nation?",
        answer:
          "Ja, det är helt gratis att använda Discount Nation. Vi tjänar pengar genom provisioner från butikerna när du handlar via våra länkar, men det kostar dig ingenting extra.",
      },
      {
        question: "Hur ofta uppdateras erbjudandena?",
        answer:
          "Vi uppdaterar våra erbjudanden dagligen för att säkerställa att du alltid har tillgång till de senaste och bästa dealsen. Gamla eller utgångna erbjudanden tas bort regelbundet.",
      },
    ],
  },
  {
    category: "Rabattkoder",
    questions: [
      {
        question: "Hur använder jag en rabattkod?",
        answer:
          "Klicka på 'Visa kod' på det erbjudande du vill använda. Koden kopieras automatiskt och du omdirigeras till butikens webbplats. Klistra in koden i kassan för att få rabatten.",
      },
      {
        question: "Varför fungerar inte min rabattkod?",
        answer:
          "Det kan finnas flera anledningar: koden kan ha gått ut, ha begränsningar (minimum köpbelopp, specifika produkter), eller redan ha använts om det är en engångskod. Kontrollera alltid villkoren för koden.",
      },
      {
        question: "Kan jag kombinera flera rabattkoder?",
        answer:
          "Det beror på butikens policy. De flesta butiker tillåter endast en rabattkod per beställning, men vissa erbjudanden kan kombineras med butikens egna kampanjer.",
      },
      {
        question: "Hur länge är rabattkoderna giltiga?",
        answer:
          "Giltighetstiden varierar per erbjudande. Vi visar alltid utgångsdatumet när det är känt. Vissa koder har ingen utgångstid medan andra kan vara begränsade till några dagar.",
      },
    ],
  },
  {
    category: "Teknisk support",
    questions: [
      {
        question: "Varför kan jag inte se rabattkoden?",
        answer:
          "Du behöver klicka på 'Visa kod' knappen och genomföra säkerhetsverifieringen (captcha eller pussel) för att se koden. Detta skyddar mot automatiserad missbruk.",
      },
      {
        question: "Fungerar sajten på mobilen?",
        answer:
          "Ja, Discount Nation är fullt responsiv och fungerar perfekt på alla enheter - mobiler, surfplattor och datorer. Du får samma funktionalitet oavsett enhet.",
      },
      {
        question: "Varför måste jag lösa ett pussel för att se koden?",
        answer:
          "Säkerhetsverifieringen hjälper oss att förhindra automatiserad missbruk av våra rabattkoder och säkerställer att koderna är tillgängliga för riktiga användare.",
      },
    ],
  },
  {
    category: "Butiker & Erbjudanden",
    questions: [
      {
        question: "Vilka butiker samarbetar ni med?",
        answer:
          "Vi samarbetar med Sveriges populäraste elektronikbutiker inklusive Elgiganten, Power, NetOnNet, Webhallen, Komplett och CDON. Vi utökar ständigt vårt nätverk av partnerbutiker.",
      },
      {
        question: "Kan jag föreslå en ny butik?",
        answer:
          "Absolut! Kontakta oss via vårt kontaktformulär och föreslå butiker du skulle vilja se på Discount Nation. Vi utvärderar alla förslag.",
      },
      {
        question: "Varför finns det inga erbjudanden för en specifik produkt?",
        answer:
          "Erbjudandena beror på vad våra partnerbutiker har för kampanjer. Vi kan inte garantera erbjudanden för specifika produkter, men vi arbetar ständigt för att hitta de bästa dealsen.",
      },
    ],
  },
  {
    category: "Konto & Prenumeration",
    questions: [
      {
        question: "Behöver jag skapa ett konto?",
        answer:
          "Nej, du behöver inte skapa ett konto för att använda våra rabattkoder. Du kan dock prenumerera på vårt nyhetsbrev för att få de senaste erbjudandena direkt i din inkorg.",
      },
      {
        question: "Hur avregistrerar jag mig från nyhetsbrevet?",
        answer:
          "Du kan enkelt avregistrera dig genom att klicka på 'Avregistrera' länken i botten av vilket nyhetsbrev som helst, eller kontakta oss direkt.",
      },
      {
        question: "Vilken information samlar ni in?",
        answer:
          "Vi samlar endast in nödvändig information som e-postadress för nyhetsbrev och grundläggande användningsstatistik. Läs vår sekretesspolicy för fullständig information.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vanliga frågor <span className="text-green-600">(FAQ)</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hitta svar på de vanligaste frågorna om Discount Nation, rabattkoder och hur du får ut det mesta av våra
            erbjudanden.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <FAQItem key={faqIndex} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-2xl mx-auto mt-16 text-center bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Hittade du inte svar på din fråga?</h3>
          <p className="text-gray-600 mb-6">
            Kontakta oss så hjälper vi dig gärna! Vi svarar vanligtvis inom 24 timmar.
          </p>
          <a
            href="/kontakta-oss"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Kontakta oss
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
      <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
        <h3 className="text-lg font-medium text-gray-900 pr-4">{question}</h3>
        <ChevronDown className="w-5 h-5 text-gray-500 group-open:hidden flex-shrink-0" />
        <ChevronUp className="w-5 h-5 text-gray-500 hidden group-open:block flex-shrink-0" />
      </summary>
      <div className="px-6 pb-6">
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </details>
  )
}
