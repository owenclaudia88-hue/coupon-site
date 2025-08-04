"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Header from "./components/Header"
import Footer from "./components/Footer"
import {
  Search,
  Star,
  TrendingUp,
  Gift,
  Zap,
  ShoppingBag,
  Smartphone,
  Tv,
  Laptop,
  Home,
  Gamepad2,
  Camera,
} from "lucide-react"

const featuredStores = [
  {
    name: "Elgiganten",
    logo: "/images/elgiganten-logo.svg",
    discount: "Upp till 70%",
    deals: "13 aktiva erbjudanden",
    rating: 4.5,
    href: "/elgiganten",
    color: "bg-green-600",
  },
  {
    name: "Power",
    logo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    discount: "Upp till 50%",
    deals: "12 aktiva erbjudanden",
    rating: 4.4,
    href: "/power",
    color: "bg-red-600",
  },
  {
    name: "NetOnNet",
    logo: "/images/netonnet-logo.svg",
    discount: "Upp till 50%",
    deals: "12 aktiva erbjudanden",
    rating: 4.4,
    href: "/netonnet",
    color: "bg-blue-600",
  },
  {
    name: "Webhallen",
    logo: "/images/webhallen-logo.png",
    discount: "Upp till 35%",
    deals: "12 aktiva erbjudanden",
    rating: 4.2,
    href: "/webhallen",
    color: "bg-orange-600",
  },
  {
    name: "Komplett",
    logo: "/images/komplett-logo.svg",
    discount: "Upp till 45%",
    deals: "9 aktiva erbjudanden",
    rating: 4.1,
    href: "/komplett",
    color: "bg-purple-600",
  },
  {
    name: "CDON",
    logo: "/images/cdon-logo.png",
    discount: "Upp till 60%",
    deals: "15 aktiva erbjudanden",
    rating: 4.0,
    href: "/cdon",
    color: "bg-orange-500",
  },
]

// Updated categories with real data from store pages
const categories = [
  { name: "TV & Elektronik", icon: Tv, count: "18 erbjudanden", color: "bg-purple-500", href: "/elgiganten" },
  { name: "Smartphones", icon: Smartphone, count: "8 erbjudanden", color: "bg-green-500", href: "/power" },
  { name: "Datorer & Laptops", icon: Laptop, count: "15 erbjudanden", color: "bg-orange-500", href: "/netonnet" },
  { name: "Gaming", icon: Gamepad2, count: "12 erbjudanden", color: "bg-red-500", href: "/webhallen" },
  { name: "Vitvaror", icon: Home, count: "9 erbjudanden", color: "bg-teal-500", href: "/power" },
  { name: "Ljudprodukter", icon: Zap, count: "7 erbjudanden", color: "bg-blue-500", href: "/cdon" },
  { name: "Mode & Kläder", icon: ShoppingBag, count: "6 erbjudanden", color: "bg-pink-500", href: "/cdon" },
  { name: "Foto & Kamera", icon: Camera, count: "4 erbjudanden", color: "bg-indigo-500", href: "/cdon" },
]

const trendingDeals = [
  {
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    title: "iPhone 16 Pro Max - Upp till 70% rabatt",
    discount: "70%",
    originalPrice: "15,990 kr",
    salePrice: "4,797 kr",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop&crop=center",
    expires: "15 sep",
    href: "/elgiganten",
  },
  {
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    title: 'Samsung 65" QLED TV - 2000 kr rabatt',
    discount: "25%",
    originalPrice: "12,990 kr",
    salePrice: "9,742 kr",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&crop=center",
    expires: "30 sep",
    href: "/power",
  },
  {
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    title: "MacBook Air M2",
    discount: "25%",
    originalPrice: "13,995 kr",
    salePrice: "10,496 kr",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&crop=center",
    expires: "30 sep",
    href: "/netonnet",
  },
  {
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    title: "Gaming-dator RTX 4070",
    discount: "30%",
    originalPrice: "18,990 kr",
    salePrice: "13,293 kr",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop&crop=center",
    expires: "25 sep",
    href: "/komplett",
  },
]

// Add search data structure
const searchableStores = [
  { name: "Elgiganten", href: "/elgiganten", deals: 13 },
  { name: "Power", href: "/power", deals: 12 },
  { name: "NetOnNet", href: "/netonnet", deals: 12 },
  { name: "Webhallen", href: "/webhallen", deals: 12 },
  { name: "Komplett", href: "/komplett", deals: 9 },
  { name: "CDON", href: "/cdon", deals: 15 },
]

const searchableDiscounts = [
  { title: "iPhone", store: "Elgiganten", href: "/elgiganten", discount: "70%" },
  { title: "Samsung TV", store: "Power", href: "/power", discount: "25%" },
  { title: "MacBook", store: "NetOnNet", href: "/netonnet", discount: "25%" },
  { title: "Gaming dator", store: "Webhallen", href: "/webhallen", discount: "30%" },
  { title: "Laptop", store: "Komplett", href: "/komplett", discount: "45%" },
  { title: "Elektronik", store: "CDON", href: "/cdon", discount: "60%" },
  { title: "TV", store: "Elgiganten", href: "/elgiganten", discount: "40%" },
  { title: "Smartphone", store: "Power", href: "/power", discount: "50%" },
  { title: "Dator", store: "Komplett", href: "/komplett", discount: "45%" },
  { title: "Hörlurar", store: "CDON", href: "/cdon", discount: "40%" },
]

// Update the component's state and search functionality
export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [email, setEmail] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const query = searchQuery.toLowerCase().trim()

    // First check if it's a store name
    const storeMatch = searchableStores.find((store) => store.name.toLowerCase().includes(query))

    if (storeMatch) {
      // Redirect to store page
      window.location.href = storeMatch.href
      return
    }

    // Then search for discounts/products
    const discountMatches = searchableDiscounts.filter(
      (discount) => discount.title.toLowerCase().includes(query) || discount.store.toLowerCase().includes(query),
    )

    if (discountMatches.length > 0) {
      // Redirect to the first matching store
      window.location.href = discountMatches[0].href
      return
    }

    // If no matches found, show a message or redirect to a search results page
    alert(
      `Inga resultat hittades för "${searchQuery}". Försök söka efter butiker som Elgiganten, Power, NetOnNet, Webhallen, Komplett eller CDON.`,
    )
  }

  // Handle real-time search suggestions
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length > 1) {
      setIsSearching(true)
      const query = value.toLowerCase()

      // Search stores
      const storeResults = searchableStores
        .filter((store) => store.name.toLowerCase().includes(query))
        .map((store) => ({ ...store, type: "store" }))

      // Search discounts
      const discountResults = searchableDiscounts
        .filter(
          (discount) => discount.title.toLowerCase().includes(query) || discount.store.toLowerCase().includes(query),
        )
        .map((discount) => ({ ...discount, type: "discount" }))

      const allResults = [...storeResults, ...discountResults].slice(0, 6)
      setSearchResults(allResults)
      setShowSearchResults(allResults.length > 0)
      setIsSearching(false)
    } else {
      setShowSearchResults(false)
      setSearchResults([])
    }
  }

  // Handle clicking on search result
  const handleResultClick = (result: any) => {
    setSearchQuery("")
    setShowSearchResults(false)
    window.location.href = result.href
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Sveriges bästa rabattkoder och erbjudanden
            </h1>
            <p className="text-lg md:text-xl mb-8 text-green-100 leading-relaxed">
              Spara pengar på dina favoritbutiker med våra verifierade rabattkoder. Upptäck fantastiska erbjudanden från
              Sveriges mest populära butiker.
            </p>

            {/* Enhanced Search Bar */}
            <div ref={searchRef} className="max-w-2xl mx-auto mb-8 relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    placeholder="Sök efter butik eller rabattkod... (t.ex. Elgiganten, iPhone, TV)"
                    className="w-full px-6 py-4 pr-16 text-gray-900 text-lg rounded-xl border-0 shadow-lg bg-white bg-opacity-95 placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-green-300 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors"
                  >
                    <Search className="w-6 h-6" />
                  </button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      Söker...
                    </div>
                  ) : (
                    <>
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          {result.type === "store" ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">{result.name}</div>
                                <div className="text-sm text-gray-600">{result.deals} aktiva erbjudanden</div>
                              </div>
                              <div className="text-green-600 text-sm font-medium">Butik →</div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">{result.title}</div>
                                <div className="text-sm text-gray-600">hos {result.store}</div>
                              </div>
                              <div className="text-green-600 text-sm font-medium">{result.discount} rabatt</div>
                            </div>
                          )}
                        </button>
                      ))}
                      <div className="px-6 py-3 bg-gray-50 text-center">
                        <button
                          onClick={handleSearch}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          Se alla resultat för "{searchQuery}" →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold">Populära</div>
                <div className="text-green-200 text-sm md:text-base">Butiker</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">Dagliga</div>
                <div className="text-green-200 text-sm md:text-base">Uppdateringar</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">Nöjda</div>
                <div className="text-green-200 text-sm md:text-base">Kunder</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">Stora</div>
                <div className="text-green-200 text-sm md:text-base">Besparingar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Populära butiker</h2>
            <p className="text-gray-600 text-lg">Upptäck de bästa erbjudandena från våra mest populära partners</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStores.map((store, index) => (
              <Link
                key={index}
                href={store.href}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-24 h-12 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                    <img
                      src={store.logo || "/placeholder.svg"}
                      alt={`${store.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className={`${store.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {store.discount}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {store.name}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{store.deals}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span>{store.rating}</span>
                  </div>
                </div>

                <div className="text-green-600 font-semibold text-sm group-hover:text-green-700 transition-colors">
                  Se alla erbjudanden →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Handla efter kategori</h2>
            <p className="text-gray-600 text-lg">Hitta rabattkoder för alla dina favoritkategorier</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-gray-200"
              >
                <div
                  className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Deals */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Trendiga erbjudanden</h2>
              <p className="text-gray-600">De hetaste dealsen just nu</p>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-semibold">Populärt</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDeals.map((deal, index) => (
              <Link
                key={index}
                href={deal.href}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <img src={deal.image || "/placeholder.svg"} alt={deal.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    -{deal.discount}
                  </div>
                  <div className="absolute top-3 right-3 bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                    {deal.expires}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
                      <img
                        src={deal.storeLogo || "/placeholder.svg"}
                        alt={`${deal.store} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs text-gray-500">{deal.store}</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">{deal.title}</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-green-600">{deal.salePrice}</div>
                      <div className="text-sm text-gray-500 line-through">{deal.originalPrice}</div>
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      Se deal
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Gift className="w-16 h-16 mx-auto mb-6 text-green-200" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Missa aldrig ett erbjudande</h2>
            <p className="text-green-100 text-lg mb-8">
              Få de senaste rabattkoderna och exklusiva erbjudandena direkt i din inkorg
            </p>

            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Din e-postadress"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 bg-white bg-opacity-95 placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-green-300 focus:bg-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Prenumerera
              </button>
            </form>

            <p className="text-green-200 text-sm mt-4">Tusentals prenumeranter litar på oss</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
