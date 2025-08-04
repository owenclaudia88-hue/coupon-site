export default function NetOnNetSelectedProducts() {
  const products = [
    {
      number: 1,
      text: "NetOnNet har en omfattande 'Teknikguide'-sektion där du hittar artiklar, recensioner och köpguider för att hjälpa dig göra rätt val. Låt NetOnNet vägleda dig till den perfekta tekniken.",
    },
    {
      number: 2,
      text: "Har du frågor om ditt köp? Kolla in NetOnNets 'Kundservice' där du hittar svar på vanliga frågor, kontaktinformation och hjälp med dina tekniska funderingar.",
    },
    {
      number: 3,
      text: "NetOnNet har flera stora kampanjer under året. Missa inte att fynda under Black Friday, Cyber Monday eller deras regelbundna teknikreor med fantastiska priser.",
    },
    {
      number: 4,
      text: "Osäker på vilken NetOnNet-butik som ligger närmast? Använd deras 'Hitta butik'-verktyg för att enkelt lokalisera närmaste butik och öppettider.",
    },
  ]

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Utvalda NetOnNet produkter och tjänster</h2>
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.number} className="flex items-start space-x-3">
              <span className="text-lg font-semibold text-gray-900 mt-1">{product.number}.</span>
              <p className="text-gray-700 leading-relaxed">{product.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
