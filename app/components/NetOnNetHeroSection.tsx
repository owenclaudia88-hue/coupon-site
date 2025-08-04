export default function NetOnNetHeroSection() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
      <div className="w-20 h-12 sm:w-24 sm:h-16 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200 p-2 flex-shrink-0">
        <img src="/images/netonnet-logo.svg" alt="NetOnNet Logo" className="w-full h-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">NetOnNet Rabattkoder</h1>
        <p className="text-blue-600 text-base sm:text-lg mt-1">
          Spara stort på elektronik och teknik – uppdaterad dagligen
        </p>
      </div>
    </div>
  )
}
