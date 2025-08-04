export default function SelectedProducts() {
  const products = [
    {
      number: 1,
      text: "Du har väl inte missat Elgigantens stora 'Guider och Inspiration'-sektion? Där hittar du artiklar, råd och guider i stor utsträckning. Låt Elgiganten hjälpa dig att göra ett välgrundat val.",
    },
    {
      number: 2,
      text: "Om du har några frågor eller funderingar, kolla in Elgigantens 'Kundservice'-flik där du hittar svar på många vanliga frågor samt kontaktinformation.",
    },
    {
      number: 3,
      text: "Elektronikjätten har flera stora kampanjer som återkommer årligen. Du har väl inte missat att fynda under mellandagsrean? Eller Black Friday?",
    },
    {
      number: 4,
      text: "Osäker på vilken butik som är mest bekväm för dig? Använd Elgigantens 'Hitta butik'-verktyg.",
    },
  ]

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Utvalda Elgiganten produkter och tjänster</h2>
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
