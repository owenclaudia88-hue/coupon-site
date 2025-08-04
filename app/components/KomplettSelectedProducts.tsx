export default function KomplettSelectedProducts() {
  const products = [
    {
      id: 1,
      name: 'HP Victus Gaming Laptop 15-fb3019no 15,6" FHD 144 Hz',
      description: "GeForce RTX 4050, Ryzen 7 7745H, 16 GB RAM, 512 GB SSD, Windows 11 Home",
      price: "9 990:-",
      originalPrice: "10 990:-",
      savings: "SPARA 1000:-",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
      badge: "KAMPANJ",
      availability: "Redo att skickas 6 augusti 2025 (28 st)",
      flex: "FLEX 392:- /mån.",
    },
    {
      id: 2,
      name: "HP OmniBook Ultra 14-fd0031no",
      description: "Ultrabook med senaste Intel-processor och premium design",
      price: "17 990:-",
      originalPrice: "19 990:-",
      savings: "SPARA 2 000:-",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      badge: "KAMPANJ",
      rating: 2,
      reviews: "(1 recensioner)",
      availability: "43 st i lager (1-3 dagar leveranstid)",
      flex: "FLEX 687:- /mån.",
    },
    {
      id: 3,
      name: "Xiaomi Redmi A5 64GB (svart)",
      description: 'Smartphone, 6,88"-skärm 120Hz, 32+8 MP kamera, 3GB RAM, 4G',
      price: "1 290:-",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      badge: "B",
      badgeType: "energy",
      availability: "20+ st i lager (1-3 dagar leveranstid)",
    },
    {
      id: 4,
      name: "Philips Airfryer 3000 series XL",
      description: "Philips Airfryer Essential 3000 series XL",
      price: "990:-",
      originalPrice: "2 190:-",
      savings: "SPARA 1200:-",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      badge: "KAMPANJ",
      rating: 4.5,
      reviews: "(396 recensioner)",
      availability: "20+ st i lager (1-3 dagar leveranstid)",
      variants: "Finns i flera varianter",
    },
    {
      id: 5,
      name: 'Acer Chromebook Plus CB514 14" FHD med Google AI',
      description: "Chromebook Plus gir deg AI-funksjoner, full HD skjerm- og kamera og laptopen starter...",
      price: "4 690:-",
      originalPrice: "5 490:-",
      savings: "SPARA 800:-",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      badge: "KAMPANJ",
      availability: "33 st i lager (1-3 dagar leveranstid)",
      flex: "FLEX 184:- /mån.",
    },
    {
      id: 6,
      name: "JBL Tour One M2 ANC Trådlösa Hörlurar, Over-ear (svart)",
      description: "Bluetooth 5.3, adaptiv brusreducering (ANC), upp till 50 timmars batteritid",
      price: "1 990:-",
      originalPrice: "2 989:-",
      savings: "SPARA 999:-",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      badge: "KAMPANJ",
      rating: 4.5,
      reviews: "(139 recensioner)",
      availability: "20+ st i lager (1-3 dagar leveranstid)",
      flex: "FLEX 73:- /mån.",
    },
    {
      id: 7,
      name: 'Acer Aspire Lite 15 15,6" FHD',
      description: "128 GB SSD-lagring, 8 timmars batteritid, lätt och kraftfull – perfekt för vardagsbruk.",
      price: "3 290:-",
      originalPrice: "3 990:-",
      savings: "SPARA 700:-",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
      badge: "KAMPANJ",
      specialBadge: "KOLLA PRISET!",
      rating: 3.5,
      reviews: "(7 recensioner)",
      availability: "50+ st i lager (1-3 dagar leveranstid)",
      flex: "FLEX 126:- /mån.",
      variants: "Finns i flera varianter",
    },
    {
      id: 8,
      name: 'Lenovo Ideapad Slim 3 14" FHD (arctic grey)',
      description: "Intel Graphics, Core i5-12450H, 16 GB RAM, 1 TB SSD, Windows 11 Home",
      price: "6 990:-",
      originalPrice: "8 990:-",
      savings: "SPARA 2 000:-",
      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop",
      badge: "KAMPANJ",
      availability: "50+ st i lager (1-3 dagar leveranstid)",
      flex: "FLEX 267:- /mån.",
    },
  ]

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>,
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>,
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>,
      )
    }

    return stars
  }

  return (
    <section className="mt-8 md:mt-12">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Utvalda produkter från Komplett</h2>
        <p className="text-gray-600">Upptäck våra mest populära produkter med bästa priserna</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
          >
            <div className="relative mb-4">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute top-2 left-2">
                {product.badgeType === "energy" ? (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">{product.badge}</span>
                ) : (
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">{product.badge}</span>
                )}
              </div>
              {product.specialBadge && (
                <div className="absolute top-2 right-2">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {product.specialBadge}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{product.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>

              {product.rating && (
                <div className="flex items-center space-x-1">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-xs text-gray-500">{product.reviews}</span>
                </div>
              )}

              {product.variants && <p className="text-xs text-gray-500">{product.variants}</p>}

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  {product.savings && (
                    <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                      {product.savings}
                    </span>
                  )}
                </div>
                {product.originalPrice && <p className="text-xs text-gray-500">Ord. pris {product.originalPrice}</p>}
                {product.flex && <p className="text-xs text-gray-600 font-medium">{product.flex}</p>}
              </div>

              <div className="flex items-center text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {product.availability}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
