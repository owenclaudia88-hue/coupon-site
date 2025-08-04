export default function CDONSelectedProducts() {
  const features = [
    {
      title: "Köparskydd",
      description: "Alla köp på CDON är skyddade av vårt köparskydd. Om något går fel får du pengarna tillbaka.",
      icon: "🛡️",
    },
    {
      title: "Snabb leverans",
      description: "Många produkter levereras redan nästa dag. Välj mellan hemleverans eller upphämtning.",
      icon: "🚚",
    },
    {
      title: "Miljoner produkter",
      description: "Över 4 miljoner produkter från tusentals säljare - allt på ett ställe.",
      icon: "📦",
    },
    {
      title: "Enkel retur",
      description: "30 dagars ångerrätt och enkel returprocess. Många produkter har fri retur.",
      icon: "↩️",
    },
  ]

  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Varför välja CDON?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="text-2xl md:text-3xl flex-shrink-0">{feature.icon}</div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
