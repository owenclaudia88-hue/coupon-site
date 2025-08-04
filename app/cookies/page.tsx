import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

export default function CookiesPage() {
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
              <span className="text-green-600">policy</span>
            </h1>
            <p className="text-gray-600 text-lg">Information om hur vi använder cookies på Discount Nation</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600 mb-2">Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}</p>
              <div className="text-sm text-gray-600">
                <p className="mb-1">
                  <strong>Personuppgiftsansvarig:</strong> AA DISCOUNTS LTD
                </p>
                <p className="mb-1">Adress: 344-348 High Road Ilford England IG1 1QP</p>
                <p>E-post: support@discountnation.se</p>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Vad är cookies?</h2>
              <p className="text-gray-700 mb-4">
                Cookies är små textfiler som lagras på din enhet (dator, surfplatta eller mobiltelefon) när du besöker
                en webbplats. De hjälper webbplatsen att komma ihåg information om ditt besök, som dina preferenser och
                tidigare aktiviteter.
              </p>
              <p className="text-gray-700 mb-4">
                Cookies kan vara "första parts cookies" (satta av webbplatsen du besöker) eller "tredje parts cookies"
                (satta av andra webbplatser). De kan också vara "sessionscookies" (som raderas när du stänger
                webbläsaren) eller "permanenta cookies" (som stannar på din enhet tills de upphör att gälla eller
                raderas).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Varför använder vi cookies?</h2>
              <p className="text-gray-700 mb-4">
                Vi på Discount Nation använder cookies för att förbättra din upplevelse på vår webbplats och för att
                tillhandahålla våra tjänster effektivt. Cookies hjälper oss att:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Komma ihåg dina preferenser och inställningar</li>
                <li>Förstå hur du använder vår webbplats</li>
                <li>Förbättra webbplatsens prestanda och funktionalitet</li>
                <li>Visa relevanta erbjudanden och innehåll</li>
                <li>Säkerställa webbplatsens säkerhet</li>
                <li>Tillhandahålla sociala mediefunktioner</li>
                <li>Analysera trafik och användarmönster</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Typer av cookies vi använder</h2>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Nödvändiga cookies (Alltid aktiva)</h3>
                <p className="text-gray-700 mb-3">
                  Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt och kan inte stängas av. De sätts
                  vanligtvis som svar på åtgärder du gör som motsvarar en begäran om tjänster.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Exempel på nödvändiga cookies:</h4>
                  <ul className="list-disc pl-4 text-gray-700 text-sm">
                    <li>Sessionscookies för att hålla dig inloggad</li>
                    <li>Säkerhetscookies för att förhindra bedrägerier</li>
                    <li>Cookies för att komma ihåg dina cookie-preferenser</li>
                    <li>Tekniska cookies för webbplatsens grundfunktioner</li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Funktionella cookies</h3>
                <p className="text-gray-700 mb-3">
                  Dessa cookies gör det möjligt för webbplatsen att komma ihåg val du gör och ge förbättrade, mer
                  personliga funktioner. De kan sättas av oss eller av tredjepartsleverantörer.
                </p>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Exempel på funktionella cookies:</h4>
                  <ul className="list-disc pl-4 text-gray-700 text-sm">
                    <li>Språkpreferenser</li>
                    <li>Regionala inställningar</li>
                    <li>Personaliserade erbjudanden</li>
                    <li>Sparade sökningar och filter</li>
                    <li>Tillgänglighetsinställningar</li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Analytiska cookies</h3>
                <p className="text-gray-700 mb-3">
                  Dessa cookies hjälper oss att förstå hur besökare interagerar med webbplatsen genom att samla in och
                  rapportera information anonymt. All information som samlas in är aggregerad och anonym.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Analytiska tjänster vi använder:</h4>
                  <ul className="list-disc pl-4 text-gray-700 text-sm">
                    <li>
                      <strong>Google Analytics:</strong> För att förstå webbplatsanvändning och prestanda
                    </li>
                    <li>
                      <strong>Hotjar:</strong> För att analysera användarbeteende och förbättra användarupplevelsen
                    </li>
                    <li>
                      <strong>Interna analyser:</strong> För att spåra populära erbjudanden och sidor
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Marknadsföringscookies</h3>
                <p className="text-gray-700 mb-3">
                  Dessa cookies används för att visa annonser som är mer relevanta för dig och dina intressen. De kan
                  också användas för att begränsa antalet gånger du ser en annons.
                </p>
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Marknadsföringspartners:</h4>
                  <ul className="list-disc pl-4 text-gray-700 text-sm">
                    <li>
                      <strong>Google Ads:</strong> För riktade annonser och remarketing
                    </li>
                    <li>
                      <strong>Facebook Pixel:</strong> För sociala medier-annonser
                    </li>
                    <li>
                      <strong>Affiliate-nätverk:</strong> För att spåra hänvisningar och provisioner
                    </li>
                    <li>
                      <strong>E-postmarknadsföring:</strong> För personaliserade nyhetsbrev
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Tredjepartscookies</h2>
              <p className="text-gray-700 mb-4">
                Förutom våra egna cookies använder vi också cookies från tredje part för att förbättra vår tjänst och ge
                dig en bättre upplevelse:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Services</h4>
                  <p className="text-gray-700 text-sm mb-2">Analytics, Ads, Maps</p>
                  <p className="text-gray-700 text-xs">Används för analys och marknadsföring</p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Sociala medier</h4>
                  <p className="text-gray-700 text-sm mb-2">Facebook, Twitter, Instagram</p>
                  <p className="text-gray-700 text-xs">För delningsfunktioner och sociala plugins</p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Handlarpartners</h4>
                  <p className="text-gray-700 text-sm mb-2">Elgiganten, Power, NetOnNet</p>
                  <p className="text-gray-700 text-xs">För att spåra klick och konverteringar</p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Betalningsleverantörer</h4>
                  <p className="text-gray-700 text-sm mb-2">Stripe, PayPal</p>
                  <p className="text-gray-700 text-xs">För säkra betalningar (om tillämpligt)</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Hur länge lagras cookies?</h2>
              <p className="text-gray-700 mb-4">Lagringstiden för cookies varierar beroende på typ och syfte:</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <ul className="list-disc pl-4 text-gray-700">
                  <li>
                    <strong>Sessionscookies:</strong> Raderas när du stänger webbläsaren
                  </li>
                  <li>
                    <strong>Korttidscookies:</strong> 24 timmar till 30 dagar
                  </li>
                  <li>
                    <strong>Långtidscookies:</strong> 1-2 år (för preferenser och inställningar)
                  </li>
                  <li>
                    <strong>Analytiska cookies:</strong> Upp till 26 månader (Google Analytics standard)
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Hantera dina cookie-preferenser</h2>
              <p className="text-gray-700 mb-4">
                Du har full kontroll över vilka cookies du accepterar. Du kan hantera dina preferenser på flera sätt:
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Vårt cookie-verktyg</h3>
                <p className="text-gray-700 mb-3">
                  Använd vårt cookie-inställningsverktyg för att enkelt hantera dina preferenser:
                </p>
                <Link
                  href="/cookie-installningar"
                  className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors mb-4"
                >
                  Hantera cookie-inställningar
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Webbläsarinställningar</h3>
                <p className="text-gray-700 mb-3">Du kan också kontrollera cookies direkt i din webbläsare:</p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="border border-gray-200 p-3 rounded">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Chrome</h4>
                    <p className="text-gray-700 text-xs">Inställningar → Sekretess och säkerhet → Cookies</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Firefox</h4>
                    <p className="text-gray-700 text-xs">Inställningar → Sekretess och säkerhet</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Safari</h4>
                    <p className="text-gray-700 text-xs">Inställningar → Sekretess → Cookies</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Edge</h4>
                    <p className="text-gray-700 text-xs">Inställningar → Cookies och webbplatsbehörigheter</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">⚠️ Viktigt att veta</h4>
                <p className="text-gray-700 text-sm">
                  Om du väljer att inaktivera cookies kan vissa funktioner på vår webbplats inte fungera korrekt. Du
                  kanske inte kan få personaliserade erbjudanden eller optimal prestanda.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies och personlig integritet</h2>
              <p className="text-gray-700 mb-4">
                Vi respekterar din integritet och följer alla tillämpliga dataskyddslagar, inklusive GDPR. Cookies som
                samlar in personlig information behandlas i enlighet med vår
                <Link href="/sekretesspolicy" className="text-green-600 hover:text-green-700">
                  sekretesspolicy
                </Link>
                .
              </p>
              <p className="text-gray-700 mb-4">
                De flesta cookies vi använder samlar inte in personligt identifierbar information, utan skapar istället
                en anonym profil av dina intressen och preferenser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Uppdateringar av cookiepolicy</h2>
              <p className="text-gray-700 mb-4">
                Vi kan uppdatera denna cookiepolicy från tid till annan för att återspegla ändringar i vår användning av
                cookies eller av juridiska skäl. Vi rekommenderar att du regelbundet granskar denna sida för att hålla
                dig informerad om hur vi använder cookies.
              </p>
              <p className="text-gray-700 mb-4">
                Väsentliga ändringar kommer att meddelas genom vår webbplats eller via e-post om du har prenumererat på
                vårt nyhetsbrev.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Kontakta oss</h2>
              <p className="text-gray-700 mb-4">
                Om du har frågor om vår användning av cookies eller denna cookiepolicy, tveka inte att kontakta oss:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-1">
                  <strong>AA DISCOUNTS LTD</strong>
                </p>
                <p className="text-gray-700 mb-1">Adress: 344-348 High Road Ilford England IG1 1QP</p>
                <p className="text-gray-700 mb-1">E-post: support@discountnation.se</p>
                <p className="text-gray-700">Webbplats: www.discountnation.se</p>
              </div>
            </section>
          </div>

          {/* Contact CTA */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Frågor om cookies?</h3>
            <p className="text-gray-600 mb-4">Kontakta oss om du har frågor om vår användning av cookies.</p>
            <Link
              href="/kontakta-oss"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Kontakta oss
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
