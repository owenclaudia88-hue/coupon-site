export default function KomplettMoreInformation() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Mer information om Komplett rabattkoder
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Om Komplett</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Komplett är en av Nordens ledande återförsäljare av datorer, komponenter och teknikprodukter. Sedan
                starten 1999 har Komplett varit synonymt med kvalitet, konkurrenskraftiga priser och excellent
                kundservice.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Med ett brett sortiment som sträcker sig från gaming-datorer till kontorsutrustning, erbjuder Komplett
                allt du behöver för dina teknikbehov.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Så fungerar rabattkoderna</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Klicka på "Använd rabattkod" för att aktivera erbjudandet
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Du omdirigeras automatiskt till Komplett.se
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Rabatten tillämpas automatiskt i kassan
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Ingen rabattkod behöver matas in manuellt
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Populära kategorier på Komplett</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">💻</div>
                <div className="font-medium text-gray-900">Datorer</div>
                <div className="text-sm text-gray-600">Gaming & Kontor</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🎮</div>
                <div className="font-medium text-gray-900">Gaming</div>
                <div className="text-sm text-gray-600">Komponenter</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium text-gray-900">Mobiler</div>
                <div className="text-sm text-gray-600">& Tillbehör</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🖥️</div>
                <div className="font-medium text-gray-900">Skärmar</div>
                <div className="text-sm text-gray-600">& Monitorer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
