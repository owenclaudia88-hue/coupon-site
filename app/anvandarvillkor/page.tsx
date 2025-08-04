import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900">Användarvillkor</span>
            </h1>
            <p className="text-gray-600 text-lg">Villkor för användning av Discount Nation</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600 mb-0">Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}</p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Allmänna villkor och definitioner</h2>
              <p className="text-gray-700 mb-4">
                Dessa användarvillkor ("Villkoren") reglerar din användning av webbplatsen Discount Nation
                ("Webbplatsen", "Tjänsten") som drivs av AA DISCOUNTS LTD ("vi", "oss", "vårt", "Företaget").
              </p>
              <p className="text-gray-700 mb-4">
                Genom att komma åt eller använda vår webbplats accepterar du att vara bunden av dessa Villkor. Om du
                inte accepterar alla villkor och bestämmelser i detta avtal får du inte komma åt webbplatsen eller
                använda någon tjänst.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Företagsinformation:</h3>
                <p className="text-gray-700 text-sm mb-1">AA DISCOUNTS LTD</p>
                <p className="text-gray-700 text-sm mb-1">Adress: 344-348 High Road Ilford England IG1 1QP</p>
                <p className="text-gray-700 text-sm">E-post: support@discountnation.se</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Beskrivning av tjänsten</h2>
              <p className="text-gray-700 mb-4">
                Discount Nation är en kostnadsfri tjänst som samlar och presenterar rabattkoder, kuponer och erbjudanden
                från olika svenska och internationella återförsäljare. Vi fungerar som en informationsplattform och
                förmedlare mellan användare och handlare.
              </p>
              <p className="text-gray-700 mb-4">Vår tjänst inkluderar men är inte begränsad till:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Samling och presentation av aktuella rabattkoder och kuponer</li>
                <li>Information om pågående kampanjer och erbjudanden</li>
                <li>Omdirigering till handlarnas officiella webbplatser</li>
                <li>Nyhetsbrev med exklusiva erbjudanden och uppdateringar</li>
                <li>Produktjämförelser och prisöversikter</li>
                <li>Användarrecensioner och betyg av erbjudanden</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Användarrättigheter och skyldigheter</h2>
              <p className="text-gray-700 mb-4">Som användare av Discount Nation har du rätt att:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Kostnadsfritt använda alla funktioner på webbplatsen</li>
                <li>Få tillgång till aktuella rabattkoder och erbjudanden</li>
                <li>Prenumerera på vårt nyhetsbrev</li>
                <li>Kontakta vår kundtjänst för support</li>
              </ul>

              <p className="text-gray-700 mb-4">Som användare förbinder du dig att:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Använda tjänsten endast för lagliga ändamål</li>
                <li>Inte missbruka, hacka eller försöka skada webbplatsen</li>
                <li>Inte använda automatiserade system för att samla in data</li>
                <li>Respektera andra användares rättigheter och integritet</li>
                <li>Följa handlarnas egna villkor vid användning av rabattkoder</li>
                <li>Inte sprida skadlig kod eller virus</li>
                <li>Inte publicera olämpligt eller olagligt innehåll</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Rabattkoder och erbjudanden</h2>
              <p className="text-gray-700 mb-4">
                Vi strävar efter att tillhandahålla korrekta och uppdaterade rabattkoder, men vi kan inte garantera att
                alla koder fungerar eller att erbjudanden är aktuella vid tidpunkten för användning.
              </p>
              <p className="text-gray-700 mb-4">Viktigt att notera:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Rabattkoder tillhandahålls av tredje part (handlare)</li>
                <li>Vi ansvarar inte för koders giltighet eller funktionalitet</li>
                <li>Erbjudanden kan ändras eller upphöra utan förvarning</li>
                <li>Vissa koder kan ha begränsningar eller särskilda villkor</li>
                <li>Vi får provision från handlare när du använder våra länkar</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Immateriella rättigheter</h2>
              <p className="text-gray-700 mb-4">
                Allt innehåll på Discount Nation, inklusive men inte begränsat till text, grafik, logotyper, ikoner,
                bilder, ljudklipp, digitala nedladdningar och programvara, är egendom av AA DISCOUNTS LTD eller dess
                innehållsleverantörer och skyddas av svenska och internationella upphovsrättslagar.
              </p>
              <p className="text-gray-700 mb-4">Du får inte:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Kopiera, distribuera eller modifiera vårt innehåll utan tillstånd</li>
                <li>Använda våra varumärken eller logotyper</li>
                <li>Skapa härledda verk baserade på vårt innehåll</li>
                <li>Sälja eller kommersiellt utnyttja vårt innehåll</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Ansvarsbegränsning</h2>
              <p className="text-gray-700 mb-4">
                AA DISCOUNTS LTD ansvarar inte för direkta, indirekta, tillfälliga, särskilda eller följdskador som
                uppstår från användningen av vår tjänst, inklusive men inte begränsat till:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Förluster till följd av felaktiga eller utgångna rabattkoder</li>
                <li>Problem med tredjepartshandlare eller deras webbplatser</li>
                <li>Avbrott i tjänsten eller tekniska problem</li>
                <li>Förlust av data eller information</li>
                <li>Skador på din enhet eller programvara</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Vårt totala ansvar gentemot dig för alla anspråk som uppstår från användningen av tjänsten ska inte
                överstiga 100 SEK.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Tredjepartstjänster</h2>
              <p className="text-gray-700 mb-4">
                Vår webbplats kan innehålla länkar till tredjepartswebbplatser eller tjänster som inte ägs eller
                kontrolleras av AA DISCOUNTS LTD. Vi har ingen kontroll över och tar inget ansvar för innehållet,
                sekretesspolicyn eller praxis hos tredjepartswebbplatser eller tjänster.
              </p>
              <p className="text-gray-700 mb-4">
                Du erkänner och accepterar att AA DISCOUNTS LTD inte ska vara ansvariga för skador eller förluster som
                orsakas av eller i samband med användning av sådana tredjepartstjänster.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Uppsägning</h2>
              <p className="text-gray-700 mb-4">
                Vi kan säga upp eller stänga av ditt konto och förbjuda åtkomst till tjänsten omedelbart, utan
                förvarning eller ansvar, av vilken anledning som helst, inklusive men inte begränsat till brott mot
                villkoren.
              </p>
              <p className="text-gray-700 mb-4">
                Du kan när som helst sluta använda vår tjänst genom att helt enkelt sluta komma åt webbplatsen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Ändringar av villkor</h2>
              <p className="text-gray-700 mb-4">
                Vi förbehåller oss rätten att, efter eget gottfinnande, ändra eller ersätta dessa villkor när som helst.
                Om en revidering är väsentlig kommer vi att försöka ge minst 30 dagars förvarning innan nya villkor
                träder i kraft.
              </p>
              <p className="text-gray-700 mb-4">
                Din fortsatta användning av tjänsten efter att ändringar träder i kraft utgör acceptans av de nya
                villkoren.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Tillämplig lag och jurisdiktion</h2>
              <p className="text-gray-700 mb-4">
                Dessa villkor ska tolkas och tillämpas i enlighet med engelsk lag. Alla tvister som uppstår i samband
                med dessa villkor ska avgöras av engelska domstolar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Kontaktinformation</h2>
              <p className="text-gray-700 mb-4">Om du har frågor om dessa användarvillkor, vänligen kontakta oss:</p>
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Har du frågor?</h3>
            <p className="text-gray-600 mb-4">
              Kontakta oss om du behöver hjälp eller har frågor om våra användarvillkor.
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
