"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, Menu, X, ChevronDown } from "lucide-react"

// Search data
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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isStoresDropdownOpen, setIsStoresDropdownOpen] = useState(false)
  const [isMobileStoresDropdownOpen, setIsMobileStoresDropdownOpen] = useState(false)

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsMobileStoresDropdownOpen(false)
  }

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
      setSearchQuery("")
      setShowSearchResults(false)
      return
    }

    // Then search for discounts/products
    const discountMatches = searchableDiscounts.filter(
      (discount) => discount.title.toLowerCase().includes(query) || discount.store.toLowerCase().includes(query),
    )

    if (discountMatches.length > 0) {
      // Redirect to the first matching store
      window.location.href = discountMatches[0].href
      setSearchQuery("")
      setShowSearchResults(false)
      return
    }

    // If no matches found, redirect to rabattkoder page
    window.location.href = "/rabattkoder"
    setSearchQuery("")
    setShowSearchResults(false)
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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const stores = [
    { name: "Elgiganten", href: "/elgiganten", deals: "13 erbjudanden" },
    { name: "Power", href: "/power", deals: "12 erbjudanden" },
    { name: "NetOnNet", href: "/netonnet", deals: "12 erbjudanden" },
    { name: "Webhallen", href: "/webhallen", deals: "12 erbjudanden" },
    { name: "Komplett", href: "/komplett", deals: "9 erbjudanden" },
    { name: "CDON", href: "/cdon", deals: "15 erbjudanden" },
  ]

  return (
    <>
      <header className="bg-slate-700 text-white relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-12">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-all duration-200 group">
              <div className="relative">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 rounded-lg text-sm md:text-base font-bold shadow-lg transform group-hover:scale-105 transition-all duration-200">
                  DISCOUNT
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
              </div>
              <span className="font-bold text-base md:text-lg tracking-wide text-white group-hover:text-green-300 transition-colors duration-200">
                NATION
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm">
              <Link href="/rabattkoder" className="hover:text-green-400 transition-colors">
                Rabattkoder
              </Link>

              {/* Stores Dropdown */}
              <div className="relative group">
                <button className="flex items-center hover:text-green-400 transition-colors cursor-pointer">
                  Butiker
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Populära butiker</h3>
                  </div>
                  {stores.map((store, index) => (
                    <Link
                      key={index}
                      href={store.href}
                      className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors cursor-pointer"
                    >
                      <span className="font-medium">{store.name}</span>
                      <span className="text-xs text-gray-500">{store.deals}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/om-oss" className="hover:text-green-400 transition-colors">
                Om oss
              </Link>
              <Link href="/kontakta-oss" className="hover:text-green-400 transition-colors">
                Kontakta oss
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-slate-600 rounded-lg transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Öppna meny"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Search - Enhanced with functionality */}
            <div ref={searchRef} className="relative hidden md:block">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    placeholder="Sök rabattkoder..."
                    className="bg-slate-600 text-white placeholder-gray-300 px-3 py-1 pr-8 rounded text-sm w-32 lg:w-48 focus:outline-none focus:ring-2 focus:ring-green-500 focus:w-56 transition-all duration-200"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4 text-gray-300 hover:text-white transition-colors" />
                  </button>
                </div>
              </form>

              {/* Desktop Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto min-w-80">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <span className="text-sm">Söker...</span>
                    </div>
                  ) : (
                    <>
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          {result.type === "store" ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">{result.name}</div>
                                <div className="text-xs text-gray-600">{result.deals} aktiva erbjudanden</div>
                              </div>
                              <div className="text-green-600 text-xs font-medium">Butik →</div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">{result.title}</div>
                                <div className="text-xs text-gray-600">hos {result.store}</div>
                              </div>
                              <div className="text-green-600 text-xs font-medium">{result.discount} rabatt</div>
                            </div>
                          )}
                        </button>
                      ))}
                      <div className="px-4 py-2 bg-gray-50 text-center">
                        <button
                          onClick={handleSearch}
                          className="text-green-600 hover:text-green-700 font-medium text-xs"
                        >
                          Se alla resultat för "{searchQuery}" →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu Slide-out */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-slate-700 text-white">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-all duration-200 group">
              <div className="relative">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-2 py-1 rounded text-xs font-bold shadow-md transform group-hover:scale-105 transition-all duration-200">
                  DISCOUNT
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded blur opacity-20 group-hover:opacity-40 transition-opacity duration-200"></div>
              </div>
              <span className="font-bold text-sm tracking-wide text-white group-hover:text-green-300 transition-colors duration-200">
                NATION
              </span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
              aria-label="Stäng meny"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search - Enhanced with functionality */}
          <div ref={mobileSearchRef} className="p-4 border-b border-gray-200 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="Sök rabattkoder..."
                  className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white border border-gray-200"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                </button>
              </div>
            </form>

            {/* Mobile Search Results */}
            {showSearchResults && (
              <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <span className="text-sm">Söker...</span>
                  </div>
                ) : (
                  <>
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {result.type === "store" ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{result.name}</div>
                              <div className="text-xs text-gray-600">{result.deals} aktiva erbjudanden</div>
                            </div>
                            <div className="text-green-600 text-xs font-medium">Butik →</div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{result.title}</div>
                              <div className="text-xs text-gray-600">hos {result.store}</div>
                            </div>
                            <div className="text-green-600 text-xs font-medium">{result.discount} rabatt</div>
                          </div>
                        )}
                      </button>
                    ))}
                    <div className="px-4 py-2 bg-gray-50 text-center">
                      <button
                        onClick={handleSearch}
                        className="text-green-600 hover:text-green-700 font-medium text-xs"
                      >
                        Se alla resultat för "{searchQuery}" →
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 py-4">
            <div className="space-y-1">
              <Link
                href="/rabattkoder"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Rabattkoder
              </Link>

              {/* Mobile Stores Dropdown */}
              <div>
                <button
                  onClick={() => setIsMobileStoresDropdownOpen(!isMobileStoresDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors font-medium"
                >
                  <span>Butiker</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isMobileStoresDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isMobileStoresDropdownOpen && (
                  <div className="bg-gray-50 border-t border-b border-gray-200">
                    <div className="px-4 py-2">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Populära butiker</h4>
                    </div>
                    {stores.map((store, index) => (
                      <Link
                        key={index}
                        href={store.href}
                        className="flex items-center justify-between px-6 py-2 text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <span>{store.name}</span>
                        <span className="text-xs text-gray-400">{store.deals}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/om-oss"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Om oss
              </Link>
              <Link
                href="/kontakta-oss"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Kontakta oss
              </Link>
            </div>

            {/* Additional Mobile Menu Items */}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">© 2025 Discount Nation</p>
          </div>
        </div>
      </div>
    </>
  )
}
