export default function CDONMoreInformation() {
  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Mer information om CDON Sverige</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            CDON är en av Nordens ledande marknadsplatser för e-handel, grundad 1999. Med över 20 års erfarenhet
            erbjuder CDON ett brett sortiment av produkter från tusentals säljare, allt från elektronik och mode till
            hem och trädgård.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Som marknadsplats fungerar CDON som en plattform där både CDON själva och externa säljare kan erbjuda sina
            produkter. Detta ger kunder tillgång till ett enormt utbud av produkter till konkurrenskraftiga priser.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Varför handla på CDON?</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Över 4 miljoner produkter från tusentals säljare</li>
            <li>Köparskydd på alla köp - pengarna tillbaka om något går fel</li>
            <li>Snabb leverans och flexibla leveransalternativ</li>
            <li>Enkel retur och ångerrätt enligt lag</li>
            <li>Kundservice på svenska</li>
            <li>Säker betalning med flera betalningsalternativ</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">CDON Marketplace</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            CDON Marketplace är en plattform där både CDON och externa säljare kan erbjuda sina produkter. Alla säljare
            genomgår en noggrann kontroll innan de får sälja på plattformen, vilket säkerställer kvalitet och trygghet
            för kunderna.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Kontaktinformation</h3>
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <p className="text-gray-700 mb-2">
              <strong>CDON AB</strong>
            </p>
            <p className="text-gray-700 mb-2">Regeringsgatan 29</p>
            <p className="text-gray-700 mb-2">111 53 Stockholm</p>
            <p className="text-gray-700 mb-2">Sverige</p>
            <p className="text-gray-700 mb-2">
              <strong>Kundservice:</strong> Tillgänglig via CDON.se
            </p>
            <p className="text-gray-700">
              <strong>Webbplats:</strong>{" "}
              <a href="https://cdon.se" className="text-blue-600 hover:text-blue-700">
                cdon.se
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
