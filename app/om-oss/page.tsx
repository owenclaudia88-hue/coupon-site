import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { Users, Target, Award, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Om <span className="text-green-600">Discount Nation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vi hjälper svenska konsumenter att spara pengar genom att samla de bästa rabattkoderna och erbjudandena från
            landets populäraste butiker.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Vår Mission</h2>
              <p className="text-gray-600 mb-4">
                Discount Nation grundades med en enkel vision: att göra det enkelt för alla att hitta och använda de
                bästa rabatterna online. Vi tror att alla förtjänar att spara pengar på sina inköp.
              </p>
              <p className="text-gray-600">
                Genom att samarbeta med Sveriges ledande återförsäljare kan vi erbjuda verifierade rabattkoder och
                exklusiva erbjudanden som hjälper dig att få mer för pengarna.
              </p>
            </div>
            <div className="text-center">
              <Target className="w-24 h-24 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Fokus på Besparingar</h3>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Kundcentrerat</h3>
            <p className="text-gray-600">
              Vi sätter alltid våra användare först och arbetar ständigt för att förbättra deras shoppingupplevelse.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Kvalitet</h3>
            <p className="text-gray-600">
              Alla våra rabattkoder verifieras regelbundet för att säkerställa att de fungerar när du behöver dem.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Heart className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pålitlighet</h3>
            <p className="text-gray-600">
              Vi bygger förtroende genom transparens och genom att alltid leverera på våra löften om besparingar.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Våra Resultat</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">73+</div>
              <div className="text-green-100">Aktiva Erbjudanden</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">6</div>
              <div className="text-green-100">Partnerbutiker</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">70%</div>
              <div className="text-green-100">Högsta Rabatt</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Nöjda Kunder</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Vårt Team</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto">
            Discount Nation drivs av ett dedikerat team av e-handelsexperter och teknikentusiaster som arbetar dygnet
            runt för att hitta de bästa erbjudandena åt dig. Vi är passionerade för att hjälpa svenska konsumenter att
            spara pengar och få mer värde för sina inköp.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
