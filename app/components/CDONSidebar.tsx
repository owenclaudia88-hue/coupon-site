"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function CDONSidebar() {
  const [isPopularCategoriesOpen, setIsPopularCategoriesOpen] = useState(true)
  const [isStoreStatsOpen, setIsStoreStatsOpen] = useState(true)

  return (
    <div className="space-y-6">
      {/* Popular Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button
          onClick={() => setIsPopularCategoriesOpen(!isPopularCategoriesOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">Populär kategorier</h3>
          {isPopularCategoriesOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isPopularCategoriesOpen && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Elektronik</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Mode & Kläder</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Hem & Trädgård</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Sport & Fritid</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Böcker & Media</span>
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Skönhet & Hälsa</span>
              <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm font-medium">1</span>
            </div>
          </div>
        )}
      </div>

      {/* Store Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button
          onClick={() => setIsStoreStatsOpen(!isStoreStatsOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">CDON Statistik</h3>
          {isStoreStatsOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isStoreStatsOpen && (
          <div className="mt-4 space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15</div>
              <div className="text-sm text-gray-600">Aktiva erbjudanden</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">60%</div>
              <div className="text-sm text-gray-600">Högsta rabatt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2000 kr</div>
              <div className="text-sm text-gray-600">Största besparingen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8,456</div>
              <div className="text-sm text-gray-600">Totala användningar</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Spara mer hos CDON</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">•</span>
            Kombinera rabattkoder med CDON:s egna kampanjer
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">•</span>
            Följ CDON på sociala medier för exklusiva erbjudanden
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">•</span>
            Prenumerera på nyhetsbrevet för tidiga tillgång till reor
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">•</span>
            Jämför priser mellan olika säljare på CDON Marketplace
          </li>
        </ul>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 Få de bästa erbjudandena</h3>
        <p className="text-sm text-gray-600 mb-4">
          Prenumerera på vårt nyhetsbrev och få de senaste CDON rabattkoderna direkt i din inkorg.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Din e-postadress"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 text-sm">
            Prenumerera
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Vi respekterar din integritet. Avsluta prenumerationen när som helst.
        </p>
      </div>
    </div>
  )
}
