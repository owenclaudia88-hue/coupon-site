"use client"

import { useState } from "react"
import CouponModal from "./CouponModal"

const selectedProducts = [
  {
    id: 1,
    name: "ASUS ROG Strix GeForce RTX 4070 SUPER",
    description: "Kraftfullt grafikkort för 1440p gaming med ray tracing",
    originalPrice: "8,990 kr",
    salePrice: "7,192 kr",
    discount: "20%",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop&crop=center",
    webhallen_url: "https://www.webhallen.com/",
  },
  {
    id: 2,
    name: "Logitech G Pro X Superlight 2",
    description: "Ultralätt trådlös gaming-mus för esport",
    originalPrice: "1,690 kr",
    salePrice: "1,352 kr",
    discount: "20%",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop&crop=center",
    webhallen_url: "https://www.webhallen.com/",
  },
  {
    id: 3,
    name: "ASUS ROG Swift PG27AQDM",
    description: '27" OLED gaming-monitor med 240Hz och G-Sync',
    originalPrice: "8,990 kr",
    salePrice: "7,192 kr",
    discount: "20%",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop&crop=center",
    webhallen_url: "https://www.webhallen.com/",
  },
  {
    id: 4,
    name: "SteelSeries Arctis Nova Pro Wireless",
    description: "Premium trådlöst gaming-headset med Hi-Fi ljud",
    originalPrice: "3,499 kr",
    salePrice: "2,799 kr",
    discount: "20%",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop&crop=center",
    webhallen_url: "https://www.webhallen.com/",
  },
  {
    id: 5,
    name: "Razer BlackWidow V4 Pro",
    description: "Mekaniskt gaming-tangentbord med RGB-belysning",
    originalPrice: "2,799 kr",
    salePrice: "2,239 kr",
    discount: "20%",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop&crop=center",
    webhallen_url: "https://www.webhallen.com/",
  },
  {
    id: 6,
    name: "Meta Quest 3 128GB",
    description: "Senaste VR-teknologi för immersiva gaming-upplevelser",
    originalPrice: "5,999 kr",
    salePrice: "4,799 kr",
    discount: "20%",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop&crop=center",
    webhallen_url: "https://www.webhallen.com/",
  },
]

export default function WebhallenSelectedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
  }

  return (
    <>
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Utvalda produkter från Webhallen</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    -{product.discount}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xl font-bold text-orange-600">{product.salePrice}</div>
                      <div className="text-sm text-gray-500 line-through">{product.originalPrice}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleProductClick(product)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Till produkt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coupon Modal */}
      {showModal && selectedProduct && (
        <CouponModal
          isOpen={showModal}
          onClose={handleCloseModal}
          couponCode="GAMING20"
          discount="20% rabatt"
          title={selectedProduct.name}
          description={`Få 20% rabatt på ${selectedProduct.name} hos Webhallen`}
          originalPrice={selectedProduct.originalPrice}
          salePrice={selectedProduct.salePrice}
          storeName="Webhallen"
          storeUrl={selectedProduct.webhallen_url}
          expiryDate="31 december 2024"
        />
      )}
    </>
  )
}
