import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900">Sekretess</span>
              <span className="text-green-600">policy</span>
            </h1>
            <p className="text-gray-600 text-lg">Hur vi samlar in, använder och skyddar din personliga information</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Inledning och omfattning</h2>
              <p className="text-gray-700 mb-4">
                AA DISCOUNTS LTD ("vi", "oss", "vårt") respekterar din integritet och är engagerade i att skydda din
                personliga information. Denna sekretesspolicy förklarar hur vi samlar in, använder, lagrar, delar och
                skyddar din information när du använder vår webbplats Discount Nation och relaterade tjänster.
              </p>
              <p className="text-gray-700 mb-4">
                Denna policy gäller för all information som samlas in via vår webbplats, e-postkorrespondens, och andra
                elektroniska meddelanden mellan dig och Discount Nation.
              </p>
              <p className="text-gray-700 mb-4">
                Genom att använda vår webbplats samtycker du till insamling och användning av information i enlighet med
                denna policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information vi samlar in</h2>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information du tillhandahåller direkt</h3>
                <p className="text-gray-700 mb-3">Vi samlar in information som du frivilligt ger oss, inklusive:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>
                    <strong>Kontaktinformation:</strong> Namn, e-postadress när du kontaktar oss eller prenumererar på
                    nyhetsbrev
                  </li>
                  <li>
                    <strong>Kommunikation:</strong> Meddelanden, feedback och annan korrespondens du skickar till oss
                  </li>
                  <li>
                    <strong>Marknadsföringspreferenser:</strong> Dina val gällande marknadsföringskommunikation
                  </li>
                  <li>
                    <strong>Undersökningsdata:</strong> Svar på undersökningar eller enkäter vi kan skicka
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Information vi samlar in automatiskt</h3>
                <p className="text-gray-700 mb-3">När du besöker vår webbplats samlar vi automatiskt in:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>
                    <strong>Teknisk information:</strong> IP-adress, webbläsartyp och version, operativsystem
                  </li>
                  <li>
                    <strong>Användningsdata:</strong> Sidor du besöker, tid på webbplatsen, klickdata, referral-källor
                  </li>
                  <li>
                    <strong>Enhetsidentifierare:</strong> Unik enhetsidentifierare, mobilnätverksinformation
                  </li>
                  <li>
                    <strong>Cookies och spårningsteknologier:</strong> Se vår cookiepolicy för detaljerad information
                  </li>
                  <li>
                    <strong>Geolokalisering:</strong> Ungefärlig plats baserad på IP-adress
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Information från tredje part</h3>
                <p className="text-gray-700 mb-3">Vi kan få information om dig från:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Våra affärspartners och handlare</li>
                  <li>Sociala medieplattformar (om du väljer att interagera med oss där)</li>
                  <li>Analytiska tjänsteleverantörer</li>
                  <li>Offentligt tillgängliga källor</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hur vi använder din information</h2>
              <p className="text-gray-700 mb-4">Vi använder din personliga information för följande ändamål:</p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Tillhandahållande av tjänster</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Visa relevanta rabattkoder och erbjudanden</li>
                  <li>Personalisera din upplevelse på webbplatsen</li>
                  <li>Tillhandahålla kundtjänst och teknisk support</li>
                  <li>Behandla och svara på dina förfrågningar</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Kommunikation</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Skicka nyhetsbrev och marknadsföringsmaterial (med ditt samtycke)</li>
                  <li>Informera om uppdateringar av tjänsten</li>
                  <li>Skicka administrativa meddelanden</li>
                  <li>Svara på dina frågor och kommentarer</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Förbättring och analys</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Analysera användning av webbplatsen för att förbättra våra tjänster</li>
                  <li>Genomföra forskning och utveckling</li>
                  <li>Övervaka och analysera trender och användning</li>
                  <li>Testa nya funktioner och tjänster</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Säkerhet och efterlevnad</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Förhindra bedrägerier och missbruk</li>
                  <li>Säkerställa säkerhet för webbplatsen och användare</li>
                  <li>Uppfylla juridiska förpliktelser</li>
                  <li>Genomdriva våra användarvillkor</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Rättslig grund för behandling</h2>
              <p className="text-gray-700 mb-4">
                Vi behandlar din personliga information baserat på följande rättsliga grunder:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  <strong>Samtycke:</strong> När du har gett ditt uttryckliga samtycke (t.ex. nyhetsbrev)
                </li>
                <li>
                  <strong>Kontraktsuppfyllelse:</strong> För att tillhandahålla våra tjänster
                </li>
                <li>
                  <strong>Berättigat intresse:</strong> För att förbättra våra tjänster och säkerhet
                </li>
                <li>
                  <strong>Juridisk förpliktelse:</strong> För att uppfylla lagkrav
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Delning av information</h2>
              <p className="text-gray-700 mb-4">
                Vi säljer, hyr eller delar inte din personliga information med tredje part för deras
                marknadsföringsändamål utan ditt uttryckliga samtycke. Vi kan dela information i följande fall:
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Tjänsteleverantörer</h3>
                <p className="text-gray-700 mb-3">
                  Vi delar information med betrodda tredje parter som hjälper oss att:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Tillhandahålla och underhålla vår webbplats</li>
                  <li>Skicka e-postmeddelanden</li>
                  <li>Analysera webbplatsanvändning</li>
                  <li>Tillhandahålla kundtjänst</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Affärspartners</h3>
                <p className="text-gray-700 mb-3">Vi kan dela begränsad information med:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Handlare och återförsäljare (endast aggregerad, anonymiserad data)</li>
                  <li>Reklampartners (för att visa relevanta annonser)</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Juridiska krav</h3>
                <p className="text-gray-700 mb-3">Vi kan dela information när det krävs av lag eller för att:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Svara på juridiska processer</li>
                  <li>Skydda våra rättigheter och egendom</li>
                  <li>Förhindra eller utreda misstänkt olaglig aktivitet</li>
                  <li>Skydda säkerheten för våra användare</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Datalagring och säkerhet</h2>
              <p className="text-gray-700 mb-4">
                Vi vidtar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda din personliga
                information mot obehörig åtkomst, förlust, missbruk eller ändring.
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Säkerhetsåtgärder</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>SSL-kryptering för dataöverföring</li>
                  <li>Säkra servrar och databaser</li>
                  <li>Begränsad åtkomst till personlig information</li>
                  <li>Regelbundna säkerhetsgranskningar</li>
                  <li>Personalutbildning om datasäkerhet</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Lagringsperioder</h3>
                <p className="text-gray-700 mb-3">
                  Vi behåller din personliga information endast så länge som nödvändigt för:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Tillhandahållande av våra tjänster</li>
                  <li>Uppfyllande av juridiska förpliktelser</li>
                  <li>Lösa tvister och genomdriva avtal</li>
                  <li>Affärsändamål som beskrivs i denna policy</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Dina rättigheter enligt GDPR</h2>
              <p className="text-gray-700 mb-4">
                Om du är bosatt i EU/EES har du följande rättigheter gällande din personliga information:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Rätt till tillgång</h4>
                  <p className="text-gray-700 text-sm">
                    Du har rätt att få en kopia av den personliga information vi har om dig.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Rätt till rättelse</h4>
                  <p className="text-gray-700 text-sm">
                    Du kan begära att vi korrigerar felaktig eller ofullständig information.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Rätt till radering</h4>
                  <p className="text-gray-700 text-sm">
                    Du kan begära att vi raderar din personliga information under vissa omständigheter.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Rätt till begränsning</h4>
                  <p className="text-gray-700 text-sm">
                    Du kan begära att vi begränsar behandlingen av din information.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Rätt till dataportabilitet</h4>
                  <p className="text-gray-700 text-sm">
                    Du kan begära att få din data i ett strukturerat, maskinläsbart format.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Rätt att invända</h4>
                  <p className="text-gray-700 text-sm">Du kan invända mot behandling baserad på berättigat intresse.</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                För att utöva dessa rättigheter, kontakta oss på support@discountnation.se. Vi kommer att svara på din
                begäran inom 30 dagar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies och spårningsteknologier</h2>
              <p className="text-gray-700 mb-4">
                Vi använder cookies och liknande teknologier för att förbättra din upplevelse, analysera
                webbplatsanvändning och tillhandahålla personaliserat innehåll. För detaljerad information om våra
                cookies, se vår{" "}
                <Link href="/cookies" className="text-green-600 hover:text-green-700">
                  cookiepolicy
                </Link>
                .
              </p>
              <p className="text-gray-700 mb-4">
                Du kan hantera dina cookie-preferenser genom att besöka vår
                <Link href="/cookie-installningar" className="text-green-600 hover:text-green-700 ml-1">
                  cookie-inställningssida
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Internationella dataöverföringar</h2>
              <p className="text-gray-700 mb-4">
                Din information kan överföras till och behandlas i länder utanför EU/EES. Vi säkerställer att sådana
                överföringar sker i enlighet med tillämplig dataskyddslagstiftning och med lämpliga skyddsåtgärder.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Barn och minderåriga</h2>
              <p className="text-gray-700 mb-4">
                Vår tjänst är inte avsedd för barn under 16 år. Vi samlar inte medvetet in personlig information från
                barn under 16 år. Om vi upptäcker att vi har samlat in sådan information kommer vi att radera den
                omedelbart.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Ändringar av sekretesspolicy</h2>
              <p className="text-gray-700 mb-4">
                Vi kan uppdatera denna sekretesspolicy från tid till annan för att återspegla ändringar i vår praxis
                eller av juridiska, operativa eller regulatoriska skäl. Vi kommer att meddela dig om väsentliga
                ändringar genom att publicera den nya policyn på denna sida och uppdatera datumet "Senast uppdaterad".
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Kontaktinformation och klagomål</h2>
              <p className="text-gray-700 mb-4">
                Om du har frågor om denna sekretesspolicy eller hur vi hanterar din personliga information, kontakta
                oss:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 mb-1">
                  <strong>AA DISCOUNTS LTD</strong>
                </p>
                <p className="text-gray-700 mb-1">Adress: 344-348 High Road Ilford England IG1 1QP</p>
                <p className="text-gray-700 mb-1">E-post: support@discountnation.se</p>
                <p className="text-gray-700">Webbplats: www.discountnation.se</p>
              </div>
              <p className="text-gray-700 mb-4">
                Om du är missnöjd med hur vi hanterar din personliga information har du rätt att lämna in ett klagomål
                till relevant dataskyddsmyndighet i ditt land.
              </p>
            </section>
          </div>

          {/* Contact CTA */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Frågor om integritet?</h3>
            <p className="text-gray-600 mb-4">
              Kontakta oss om du har frågor om vår sekretesspolicy eller datahantering.
            </p>
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
