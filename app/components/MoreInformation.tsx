export default function MoreInformation() {
  return (
    <section className="mt-12 prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mer information om Elgiganten Sverige</h2>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Om Elgiganten</h3>
          <p className="text-gray-700">
            Elgiganten är Nordens ledande återförsäljare av elektronik och hushållsapparater. Med över 300 butiker i
            Sverige, Norge, Danmark och Finland erbjuder Elgiganten ett brett sortiment av TV-apparater, datorer,
            smartphones, hushållsapparater och mycket mer.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Varför handla hos Elgiganten?</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Låga priser och regelbundna kampanjer</li>
            <li>Stort sortiment från kända märken</li>
            <li>Snabb leverans och flexibla leveransalternativ</li>
            <li>Professionell kundservice och support</li>
            <li>Möjlighet att hämta i butik</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Populära kategorier</h3>
          <p className="text-gray-700">
            TV & Ljud, Datorer & Surfplattor, Mobiltelefoner, Hushållsapparater, Gaming, Smart Home, Kameror & Foto,
            samt Tillbehör.
          </p>
        </div>
      </div>
    </section>
  )
}
