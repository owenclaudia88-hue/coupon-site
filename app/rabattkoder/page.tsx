"use client"

import { useState } from "react"
import { Search, Filter, TrendingUp, Users, Star } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import CouponModal from "../components/CouponModal"

interface Coupon {
  id: string
  store: string
  storeLogo: string
  storeHref: string
  title: string
  description: string
  discount: string
  code?: string
  category: string
  expiresAt: string
  usedBy: number
  isTrending?: boolean
  isFeatured?: boolean
  moreInfo?: string
  offerUrl?: string
}

const allCoupons: Coupon[] = [
  // Elgiganten - 13 offers
  {
    id: "elg-1",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "iPhone 16 Pro Max - Upp till 70% rabatt",
    description: "Spara stort på den senaste iPhone 16 Pro Max med avancerad kamerateknik och A18 Pro-chip.",
    discount: "70%",
    code: "IPHONE70",
    category: "Mobiltelefoner",
    expiresAt: "2025-03-15",
    usedBy: 1247,
    isFeatured: true,
    isTrending: true,
    moreInfo: "Begränsat erbjudande på iPhone 16 Pro Max. Få upp till 70% rabatt på den senaste iPhone-modellen.",
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-2",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "3000 kr rabatt på TV-apparater över 15000 kr",
    description: "Spara stort på premium TV-apparater från Samsung, LG och Sony med 4K och HDR-teknik.",
    discount: "3000 kr",
    code: "TV3000",
    category: "TV & Ljud",
    expiresAt: "2025-03-31",
    usedBy: 892,
    isTrending: true,
    moreInfo:
      "Få 3000 kr rabatt på TV-apparater över 15000 kr. Gäller alla märken inklusive Samsung QLED, LG OLED och Sony Bravia.",
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-3",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "30% rabatt på gaming-tillbehör",
    description: "Spara på headsets, tangentbord, möss och gaming-stolar från Razer, Logitech och SteelSeries.",
    discount: "30%",
    code: "GAMING30",
    category: "Gaming",
    expiresAt: "2025-03-20",
    usedBy: 634,
    moreInfo: "30% rabatt på alla gaming-tillbehör från Razer, Logitech, SteelSeries och andra populära gaming-märken.",
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-4",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "MacBook Air M2 - 25% rabatt",
    description: "Få 25% rabatt på MacBook Air M2 med 8-kärnig CPU och upp till 18 timmars batteritid.",
    discount: "25%",
    code: "MACBOOK25",
    category: "Datorer",
    expiresAt: "2025-03-25",
    usedBy: 456,
    moreInfo: "Spara 25% på MacBook Air M2. Perfekt för studier, arbete och kreativt skapande.",
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-5",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "Samsung Galaxy S24 Ultra - 2500 kr rabatt",
    description: "Exklusiv rabatt på Samsung Galaxy S24 Ultra med S Pen och 200MP kamera.",
    discount: "2500 kr",
    code: "GALAXY2500",
    category: "Mobiltelefoner",
    expiresAt: "2025-03-18",
    usedBy: 789,
    moreInfo: "Få 2500 kr rabatt på Samsung Galaxy S24 Ultra med AI-funktioner och professionell kamera.",
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-6",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "Sony WH-1000XM5 - 40% rabatt",
    description: "Brusreducerande hörlurar med branschledande ljudkvalitet och 30 timmars batteritid.",
    discount: "40%",
    code: "SONY40",
    category: "TV & Ljud",
    expiresAt: "2025-03-22",
    usedBy: 345,
    moreInfo: "40% rabatt på Sony WH-1000XM5 med förbättrad brusreducering och komfort.",
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-7",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "Nintendo Switch OLED - 1500 kr rabatt",
    description: "Få rabatt på Nintendo Switch OLED med 7-tums OLED-skärm och förbättrat ljud.",
    discount: "1500 kr",
    code: "SWITCH1500",
    category: "Gaming",
    expiresAt: "2025-03-31",
    usedBy: 567,
    moreInfo: "1500 kr rabatt på Nintendo Switch OLED med levande färger och kristallklar bild.",
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-8",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: 'iPad Pro 12.9" - 35% rabatt',
    description: "Kraftfull iPad Pro med M2-chip, Liquid Retina XDR-display och Apple Pencil-stöd.",
    discount: "35%",
    code: "IPADPRO35",
    category: "Datorer",
    expiresAt: "2025-03-20",
    usedBy: 423,
    moreInfo: '35% rabatt på iPad Pro 12.9" med M2-chip och professionella funktioner.',
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-9",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: 'LG OLED C3 65" - 4000 kr rabatt',
    description: "Premium OLED-TV med självlysande pixlar, Dolby Vision IQ och webOS 23.",
    discount: "4000 kr",
    code: "LGOLED4000",
    category: "TV & Ljud",
    expiresAt: "2025-04-01",
    usedBy: 234,
    isFeatured: true,
    moreInfo: '4000 kr rabatt på LG OLED C3 65" med perfekta svärtor och oändlig kontrast.',
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-10",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "AirPods Pro 2 - 30% rabatt",
    description: "Trådlösa hörlurar med adaptiv brusreducering och spatial audio.",
    discount: "30%",
    code: "AIRPODS30",
    category: "TV & Ljud",
    expiresAt: "2025-03-25",
    usedBy: 678,
    moreInfo: "30% rabatt på AirPods Pro 2 med förbättrad brusreducering och längre batteritid.",
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-11",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "PlayStation 5 + spel - 2000 kr rabatt",
    description: "PS5 konsol med två spel och extra handkontroll. Begränsat antal.",
    discount: "2000 kr",
    code: "PS5BUNDLE",
    category: "Gaming",
    expiresAt: "2025-03-15",
    usedBy: 890,
    isTrending: true,
    moreInfo: "2000 kr rabatt på PlayStation 5 bundle med spel och tillbehör.",
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-12",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: 'Samsung 85" Neo QLED - 8000 kr rabatt',
    description: "Massiv 85-tums Neo QLED TV med Quantum Matrix Technology och Object Tracking Sound.",
    discount: "8000 kr",
    code: "SAMSUNG8000",
    category: "TV & Ljud",
    expiresAt: "2025-04-05",
    usedBy: 123,
    isFeatured: true,
    moreInfo: '8000 kr rabatt på Samsung 85" Neo QLED med branschledande bildkvalitet.',
    offerUrl: "https://www.elgiganten.se",
  },
  {
    id: "elg-13",
    store: "Elgiganten",
    storeLogo: "/images/elgiganten-logo.svg",
    storeHref: "/elgiganten",
    title: "Dyson V15 Detect - 45% rabatt",
    description: "Trådlös dammsugare med laser som avslöjar mikroskopiskt damm.",
    discount: "45%",
    code: "DYSON45",
    category: "Elektronik",
    expiresAt: "2025-03-31",
    usedBy: 345,
    moreInfo: "45% rabatt på Dyson V15 Detect med avancerad dammdetektering.",
    offerUrl: "https://www.elgiganten.se",
  },

  // Power - 12 offers
  {
    id: "pow-1",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "Upp till 50% rabatt på utvalda produkter",
    description: "Spara stort på elektronik, vitvaror och teknikprodukter från kända märken.",
    discount: "50%",
    code: "POWER50",
    category: "Elektronik",
    expiresAt: "2025-03-31",
    usedBy: 1456,
    isFeatured: true,
    isTrending: true,
    moreInfo:
      "Gäller utvalda produkter inom elektronik, vitvaror och teknik. Begränsat antal produkter och begränsad tid.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-2",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "2000 kr rabatt på TV-apparater över 15000 kr",
    description: "Spara stort på premium TV-apparater från Samsung, LG och Sony.",
    discount: "2000 kr",
    code: "POWERTV2000",
    category: "TV & Ljud",
    expiresAt: "2025-04-01",
    usedBy: 723,
    moreInfo: "Gäller TV-apparater över 15000 kr från Samsung QLED, LG OLED och Sony Bravia.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-3",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "30% rabatt på hörlurar och ljudprodukter",
    description: "Spara på Sony, Bose, JBL och andra populära ljudmärken.",
    discount: "30%",
    code: "AUDIO30",
    category: "TV & Ljud",
    expiresAt: "2025-03-25",
    usedBy: 567,
    isTrending: true,
    moreInfo: "Gäller hörlurar, högtalare och soundbars från premiumvarumärken.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-4",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "iPhone 15 Pro - 3000 kr rabatt",
    description: "Exklusiv rabatt på iPhone 15 Pro med titaniumdesign och A17 Pro-chip.",
    discount: "3000 kr",
    code: "IPHONE3000",
    category: "Mobiltelefoner",
    expiresAt: "2025-03-20",
    usedBy: 890,
    moreInfo: "3000 kr rabatt på iPhone 15 Pro med professionella kamerafunktioner.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-5",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "Bosch vitvaror - 25% rabatt",
    description: "Spara på diskmaskin, tvättmaskin, kylskåp och andra vitvaror från Bosch.",
    discount: "25%",
    code: "BOSCH25",
    category: "Elektronik",
    expiresAt: "2025-04-10",
    usedBy: 234,
    moreInfo: "25% rabatt på Bosch vitvaror med energieffektiv teknik.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-6",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "Gaming-paket: Xbox Series X + spel",
    description: "Xbox Series X konsol med tre spel och Game Pass Ultimate i 3 månader.",
    discount: "2500 kr",
    code: "XBOXBUNDLE",
    category: "Gaming",
    expiresAt: "2025-03-18",
    usedBy: 456,
    moreInfo: "2500 kr rabatt på Xbox Series X bundle med spel och Game Pass.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-7",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "Samsung Galaxy Tab S9 - 35% rabatt",
    description: "Premium Android-surfplatta med S Pen och 120Hz AMOLED-display.",
    discount: "35%",
    code: "GALAXYTAB35",
    category: "Datorer",
    expiresAt: "2025-03-22",
    usedBy: 345,
    moreInfo: "35% rabatt på Samsung Galaxy Tab S9 med professionella funktioner.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-8",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "JBL Charge 5 - 40% rabatt",
    description: "Bärbar Bluetooth-högtalare med kraftfullt ljud och 20 timmars speltid.",
    discount: "40%",
    code: "JBL40",
    category: "TV & Ljud",
    expiresAt: "2025-03-31",
    usedBy: 678,
    moreInfo: "40% rabatt på JBL Charge 5 med vattentät design och kraftfullt bas.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-9",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "Dell XPS 13 - 6000 kr rabatt",
    description: "Ultrabook med Intel Core i7, 16GB RAM och 512GB SSD.",
    discount: "6000 kr",
    code: "DELLXPS6000",
    category: "Datorer",
    expiresAt: "2025-04-05",
    usedBy: 234,
    isFeatured: true,
    moreInfo: "6000 kr rabatt på Dell XPS 13 med premium design och prestanda.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-10",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "Philips Hue startpaket - 30% rabatt",
    description: "Smart belysning med färgbyte och app-kontroll för hela hemmet.",
    discount: "30%",
    code: "HUE30",
    category: "Elektronik",
    expiresAt: "2025-03-25",
    usedBy: 456,
    moreInfo: "30% rabatt på Philips Hue startpaket med smart belysning.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-11",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "GoPro Hero 12 - 45% rabatt",
    description: "Actionkamera med 5.3K video, HyperSmooth stabilisering och vattentät design.",
    discount: "45%",
    code: "GOPRO45",
    category: "Elektronik",
    expiresAt: "2025-03-20",
    usedBy: 567,
    isTrending: true,
    moreInfo: "45% rabatt på GoPro Hero 12 med professionell videokvalitet.",
    offerUrl: "https://www.power.se",
  },
  {
    id: "pow-12",
    store: "Power",
    storeLogo: "https://media.power-cdn.net/images/logos/powerse/logo.svg",
    storeHref: "/power",
    title: "Sonos Arc soundbar - 4000 kr rabatt",
    description: "Premium soundbar med Dolby Atmos och trådlös surround sound.",
    discount: "4000 kr",
    code: "SONOS4000",
    category: "TV & Ljud",
    expiresAt: "2025-04-01",
    usedBy: 123,
    moreInfo: "4000 kr rabatt på Sonos Arc med immersivt 3D-ljud.",
    offerUrl: "https://www.power.se",
  },

  // NetOnNet - 12 offers
  {
    id: "non-1",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "MacBook Air M2 - Upp till 50% rabatt",
    description: "Spara stort på den senaste MacBook Air M2 med M2-chip och Liquid Retina-display.",
    discount: "50%",
    code: "MACBOOK50",
    category: "Datorer",
    expiresAt: "2025-03-15",
    usedBy: 1089,
    isFeatured: true,
    isTrending: true,
    moreInfo: "Begräntat erbjudande på MacBook Air M2. Perfekt för studier, arbete och kreativt skapande.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-2",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "2500 kr rabatt på Samsung TV över 15000 kr",
    description: "Spara stort på premium Samsung QLED och Neo QLED TV-apparater.",
    discount: "2500 kr",
    code: "SAMSUNG2500",
    category: "TV & Ljud",
    expiresAt: "2025-04-01",
    usedBy: 445,
    moreInfo:
      "Få 2500 kr rabatt på Samsung TV-apparater över 15000 kr. Gäller alla Samsung QLED och Neo QLED modeller.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-3",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "1800 kr rabatt på iPhone 15 Pro",
    description: "Exklusiv rabatt på iPhone 15 Pro och Pro Max med titaniumdesign.",
    discount: "1800 kr",
    code: "IPHONE1800",
    category: "Mobiltelefoner",
    expiresAt: "2025-03-20",
    usedBy: 678,
    moreInfo: "Spara 1800 kr på iPhone 15 Pro och iPhone 15 Pro Max från Apple.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-4",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "HP Pavilion Gaming - 40% rabatt",
    description: "Gaming-laptop med RTX 4060, Intel Core i7 och 144Hz display.",
    discount: "40%",
    code: "HPGAMING40",
    category: "Datorer",
    expiresAt: "2025-03-25",
    usedBy: 234,
    moreInfo: "40% rabatt på HP Pavilion Gaming laptop med kraftfull prestanda.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-5",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "Sony A7 IV kamera - 7000 kr rabatt",
    description: "Fullformat systemkamera med 33MP sensor och 4K video.",
    discount: "7000 kr",
    code: "SONYA7IV",
    category: "Elektronik",
    expiresAt: "2025-04-05",
    usedBy: 156,
    isFeatured: true,
    moreInfo: "7000 kr rabatt på Sony A7 IV med professionell bildkvalitet.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-6",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "Asus ROG Strix laptop - 5000 kr rabatt",
    description: "Gaming-laptop med RTX 4070, AMD Ryzen 9 och RGB-belysning.",
    discount: "5000 kr",
    code: "ASUS5000",
    category: "Gaming",
    expiresAt: "2025-03-31",
    usedBy: 345,
    isTrending: true,
    moreInfo: "5000 kr rabatt på Asus ROG Strix med topprestanda för gaming.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-7",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "Microsoft Surface Pro 9 - 35% rabatt",
    description: "2-i-1 surfplatta med Intel Core i7 och Type Cover inkluderat.",
    discount: "35%",
    code: "SURFACE35",
    category: "Datorer",
    expiresAt: "2025-03-22",
    usedBy: 456,
    moreInfo: "35% rabatt på Microsoft Surface Pro 9 med professionell flexibilitet.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-8",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "LG UltraWide monitor - 3500 kr rabatt",
    description: "34-tums UltraWide monitor med 144Hz och USB-C docking.",
    discount: "3500 kr",
    code: "LGWIDE3500",
    category: "Datorer",
    expiresAt: "2025-03-25",
    usedBy: 234,
    moreInfo: "3500 kr rabatt på LG UltraWide monitor för produktivitet och gaming.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-9",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "Bose QuietComfort 45 - 45% rabatt",
    description: "Brusreducerande hörlurar med 24 timmars batteritid och premium komfort.",
    discount: "45%",
    code: "BOSE45",
    category: "TV & Ljud",
    expiresAt: "2025-03-20",
    usedBy: 567,
    moreInfo: "45% rabatt på Bose QuietComfort 45 med världsklass brusreducering.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-10",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "Canon EOS R6 Mark II - 8000 kr rabatt",
    description: "Fullformat systemkamera med 24.2MP sensor och dual pixel autofokus.",
    discount: "8000 kr",
    code: "CANONR6",
    category: "Elektronik",
    expiresAt: "2025-04-01",
    usedBy: 123,
    isFeatured: true,
    moreInfo: "8000 kr rabatt på Canon EOS R6 Mark II med professionell prestanda.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-11",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "Xiaomi 13 Pro - 2200 kr rabatt",
    description: "Flaggskeppstelefon med Leica-kamera och Snapdragon 8 Gen 2.",
    discount: "2200 kr",
    code: "XIAOMI2200",
    category: "Mobiltelefoner",
    expiresAt: "2025-03-18",
    usedBy: 345,
    moreInfo: "2200 kr rabatt på Xiaomi 13 Pro med professionell fotografi.",
    offerUrl: "https://www.netonnet.se",
  },
  {
    id: "non-12",
    store: "NetOnNet",
    storeLogo: "/images/netonnet-logo.svg",
    storeHref: "/netonnet",
    title: "Lenovo ThinkPad X1 Carbon - 6500 kr rabatt",
    description: "Business-laptop med Intel Core i7, 16GB RAM och 14-tums display.",
    discount: "6500 kr",
    code: "THINKPAD6500",
    category: "Datorer",
    expiresAt: "2025-03-31",
    usedBy: 234,
    moreInfo: "6500 kr rabatt på Lenovo ThinkPad X1 Carbon för professionella användare.",
    offerUrl: "https://www.netonnet.se",
  },

  // Webhallen - 12 offers
  {
    id: "web-1",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "Gaming-datorer - Upp till 35% rabatt",
    description: "Spara stort på de senaste gaming-datorerna med RTX 4070, RTX 4080 och RTX 4090.",
    discount: "35%",
    code: "GAMING35",
    category: "Gaming",
    expiresAt: "2025-03-15",
    usedBy: 1678,
    isFeatured: true,
    isTrending: true,
    moreInfo: "Begränsat erbjudande på gaming-datorer med RTX 4070, RTX 4080 och RTX 4090.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-2",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "2200 kr rabatt på grafikkort över 8000 kr",
    description: "Spara stort på RTX 4070, RTX 4080 och RTX 4090 grafikkort från NVIDIA.",
    discount: "2200 kr",
    code: "GPU2200",
    category: "Gaming",
    expiresAt: "2025-04-01",
    usedBy: 567,
    isTrending: true,
    moreInfo: "Få 2200 kr rabatt på grafikkort över 8000 kr. Gäller NVIDIA RTX 4070, RTX 4080, RTX 4090.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-3",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "25% rabatt på VR-headsets",
    description: "Spara på Meta Quest, PICO och andra VR-system för immersiva upplevelser.",
    discount: "25%",
    code: "VR25",
    category: "Gaming",
    expiresAt: "2025-03-25",
    usedBy: 234,
    moreInfo: "25% rabatt på alla VR-headsets. Gäller Meta Quest 3, PICO 4, HTC Vive och andra VR-system.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-4",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "AMD Ryzen 9 7900X - 40% rabatt",
    description: "Kraftfull processor med 12 kärnor och 24 trådar för gaming och content creation.",
    discount: "40%",
    code: "RYZEN40",
    category: "Datorer",
    expiresAt: "2025-03-20",
    usedBy: 345,
    moreInfo: "40% rabatt på AMD Ryzen 9 7900X med topprestanda för krävande uppgifter.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-5",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "Corsair gaming-setup - 30% rabatt",
    description: "Komplett gaming-setup med tangentbord, mus, headset och musmatta.",
    discount: "30%",
    code: "CORSAIR30",
    category: "Gaming",
    expiresAt: "2025-03-31",
    usedBy: 456,
    moreInfo: "30% rabatt på Corsair gaming-setup med RGB-belysning och mekaniska switchar.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-6",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "Intel Core i9-13900K - 3500 kr rabatt",
    description: "Flaggskeppsprocessor med 24 kärnor för ultimat gaming och produktivitet.",
    discount: "3500 kr",
    code: "INTEL3500",
    category: "Datorer",
    expiresAt: "2025-03-22",
    usedBy: 234,
    isFeatured: true,
    moreInfo: "3500 kr rabatt på Intel Core i9-13900K med branschledande prestanda.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-7",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "ASUS ROG Swift monitor - 4000 kr rabatt",
    description: "27-tums gaming-monitor med 240Hz, G-SYNC och HDR för kompetitiv gaming.",
    discount: "4000 kr",
    code: "ROGSWIFT4000",
    category: "Gaming",
    expiresAt: "2025-03-25",
    usedBy: 178,
    moreInfo: "4000 kr rabatt på ASUS ROG Swift monitor med ultrasnabb responstid.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-8",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "SteelSeries Arctis Pro - 50% rabatt",
    description: "Premium gaming-headset med Hi-Res audio och DTS Headphone:X 2.0.",
    discount: "50%",
    code: "ARCTIS50",
    category: "Gaming",
    expiresAt: "2025-03-20",
    usedBy: 567,
    isTrending: true,
    moreInfo: "50% rabatt på SteelSeries Arctis Pro med studiokvalitet ljud.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-9",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "MSI GeForce RTX 4080 - 5000 kr rabatt",
    description: "Kraftfullt grafikkort med 16GB GDDR6X för 4K gaming och ray tracing.",
    discount: "5000 kr",
    code: "MSI5000",
    category: "Gaming",
    expiresAt: "2025-04-01",
    usedBy: 123,
    moreInfo: "5000 kr rabatt på MSI GeForce RTX 4080 med överlägsen prestanda.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-10",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "Razer DeathAdder V3 Pro - 35% rabatt",
    description: "Trådlös gaming-mus med Focus Pro 30K sensor och 90 timmars batteritid.",
    discount: "35%",
    code: "RAZER35",
    category: "Gaming",
    expiresAt: "2025-03-18",
    usedBy: 345,
    moreInfo: "35% rabatt på Razer DeathAdder V3 Pro med precision och komfort.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-11",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "Logitech G Pro X Superlight - 40% rabatt",
    description: "Ultralätt gaming-mus med HERO 25K sensor och trådlös teknik.",
    discount: "40%",
    code: "GPRO40",
    category: "Gaming",
    expiresAt: "2025-03-31",
    usedBy: 456,
    moreInfo: "40% rabatt på Logitech G Pro X Superlight med professionell prestanda.",
    offerUrl: "https://www.webhallen.com",
  },
  {
    id: "web-12",
    store: "Webhallen",
    storeLogo: "/images/webhallen-logo.png",
    storeHref: "/webhallen",
    title: "HyperX Cloud Alpha - 45% rabatt",
    description: "Gaming-headset med dual chamber drivers och avtagbar mikrofon.",
    discount: "45%",
    code: "HYPERX45",
    category: "Gaming",
    expiresAt: "2025-03-25",
    usedBy: 234,
    moreInfo: "45% rabatt på HyperX Cloud Alpha med kristallklart ljud.",
    offerUrl: "https://www.webhallen.com",
  },

  // Komplett - 9 offers
  {
    id: "kom-1",
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    storeHref: "/komplett",
    title: "Upp till 45% rabatt på datorer och komponenter",
    description: "Spara stort på processorer, grafikkort och färdigbyggda datorer från Intel, AMD och NVIDIA.",
    discount: "45%",
    code: "KOMPLETT45",
    category: "Datorer",
    expiresAt: "2025-03-31",
    usedBy: 834,
    isFeatured: true,
    isTrending: true,
    moreInfo: "Gäller datorkomponenter och färdigbyggda datorer från Intel, AMD, NVIDIA och andra märken.",
    offerUrl: "https://www.komplett.se",
  },
  {
    id: "kom-2",
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    storeHref: "/komplett",
    title: "2000 kr rabatt på gaming-setup",
    description: "Exklusiv rabatt när du köper dator + skärm + tillbehör för minst 25000 kr.",
    discount: "2000 kr",
    code: "SETUP2000",
    category: "Gaming",
    expiresAt: "2025-03-20",
    usedBy: 392,
    moreInfo: "Gäller när du köper gaming-dator, skärm och gaming-tillbehör för minst 25000 kr totalt.",
    offerUrl: "https://www.komplett.se",
  },
  {
    id: "kom-3",
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    storeHref: "/komplett",
    title: "25% rabatt på gaming-skärmar",
    description: "Spara på gaming-monitorer från ASUS, MSI och Acer med 144Hz eller högre.",
    discount: "25%",
    code: "MONITOR25",
    category: "Datorer",
    expiresAt: "2025-03-25",
    usedBy: 456,
    moreInfo: "Gäller gaming-skärmar med 144Hz eller högre uppdateringsfrekvens.",
    offerUrl: "https://www.komplett.se",
  },
  {
    id: "kom-4",
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    storeHref: "/komplett",
    title: "NVIDIA RTX 4090 - 6000 kr rabatt",
    description: "Flaggskeppsgrafikkort med 24GB GDDR6X för ultimat 4K gaming.",
    discount: "6000 kr",
    code: "RTX4090",
    category: "Gaming",
    expiresAt: "2025-04-01",
    usedBy: 123,
    isFeatured: true,
    moreInfo: "6000 kr rabatt på NVIDIA RTX 4090 med branschledande prestanda.",
    offerUrl: "https://www.komplett.se",
  },
  {
    id: "kom-5",
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    storeHref: "/komplett",
    title: "Samsung 980 PRO SSD - 40% rabatt",
    description: "NVMe SSD med PCIe 4.0 för blixtsnabba laddningstider och överföringar.",
    discount: "40%",
    code: "SSD40",
    category: "Datorer",
    expiresAt: "2025-03-22",
    usedBy: 567,
    moreInfo: "40% rabatt på Samsung 980 PRO SSD med upp till 7000 MB/s läshastighet.",
    offerUrl: "https://www.komplett.se",
  },
  {
    id: "kom-6",
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    storeHref: "/komplett",
    title: "Corsair DDR5 RAM - 35% rabatt",
    description: "Högpresterande DDR5 minne med RGB-belysning för gaming och content creation.",
    discount: "35%",
    code: "DDR535",
    category: "Datorer",
    expiresAt: "2025-03-31",
    usedBy: 234,
    moreInfo: "35% rabatt på Corsair DDR5 RAM med höga hastigheter och RGB.",
    offerUrl: "https://www.komplett.se",
  },
  {
    id: "kom-7",
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    storeHref: "/komplett",
    title: "ASUS TUF Gaming laptop - 4500 kr rabatt",
    description: "Gaming-laptop med RTX 4060, AMD Ryzen 7 och 144Hz display.",
    discount: "4500 kr",
    code: "TUF4500",
    category: "Gaming",
    expiresAt: "2025-03-18",
    usedBy: 345,
    isTrending: true,
    moreInfo: "4500 kr rabatt på ASUS TUF Gaming laptop med robust design.",
    offerUrl: "https://www.komplett.se",
  },
  {
    id: "kom-8",
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    storeHref: "/komplett",
    title: "Cooler Master nätaggregat - 30% rabatt",
    description: "80+ Gold certifierat nätaggregat med modulära kablar och tyst drift.",
    discount: "30%",
    code: "PSU30",
    category: "Datorer",
    expiresAt: "2025-03-25",
    usedBy: 178,
    moreInfo: "30% rabatt på Cooler Master nätaggregat med hög effektivitet.",
    offerUrl: "https://www.komplett.se",
  },
  {
    id: "kom-9",
    store: "Komplett",
    storeLogo: "/images/komplett-logo.svg",
    storeHref: "/komplett",
    title: "Fractal Design chassi - 25% rabatt",
    description: "Premium datorchassi med elegant design och utmärkt luftflöde.",
    discount: "25%",
    code: "FRACTAL25",
    category: "Datorer",
    expiresAt: "2025-03-31",
    usedBy: 234,
    moreInfo: "25% rabatt på Fractal Design chassi med skandinavisk design.",
    offerUrl: "https://www.komplett.se",
  },

  // CDON - 15 offers
  {
    id: "cdo-1",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "Upp till 60% rabatt på elektronik",
    description: "Spara stort på TV-apparater, ljudsystem och elektronik från kända märken.",
    discount: "60%",
    code: "CDON60",
    category: "Elektronik",
    expiresAt: "2025-03-31",
    usedBy: 2134,
    isFeatured: true,
    isTrending: true,
    moreInfo: "Gäller utvalda elektronikprodukter från Samsung, Sony, LG och andra märken.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-2",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "2000 kr rabatt på smartphones över 10000 kr",
    description: "Exklusiv rabatt på iPhone och Samsung Galaxy telefoner från olika säljare.",
    discount: "2000 kr",
    code: "PHONE2000",
    category: "Mobiltelefoner",
    expiresAt: "2025-03-20",
    usedBy: 1567,
    moreInfo: "Gäller smartphones över 10000 kr från Apple iPhone och Samsung Galaxy serien.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-3",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "40% rabatt på gaming-produkter",
    description: "Spara på spelkonsoler, spel och gaming-tillbehör från olika säljare.",
    discount: "40%",
    code: "GAMING40",
    category: "Gaming",
    expiresAt: "2025-03-25",
    usedBy: 890,
    moreInfo: "Gäller PlayStation, Xbox, Nintendo och gaming-tillbehör från olika säljare på CDON.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-4",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "Samsung Galaxy S24 Ultra - 3000 kr rabatt",
    description: "Flaggskeppstelefon med S Pen, 200MP kamera och AI-funktioner.",
    discount: "3000 kr",
    code: "S24ULTRA",
    category: "Mobiltelefoner",
    expiresAt: "2025-03-18",
    usedBy: 456,
    isTrending: true,
    moreInfo: "3000 kr rabatt på Samsung Galaxy S24 Ultra med professionella kamerafunktioner.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-5",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "Apple Watch Series 9 - 35% rabatt",
    description: "Smartklocka med S9-chip, Always-On Retina display och avancerade hälsofunktioner.",
    discount: "35%",
    code: "WATCH35",
    category: "Elektronik",
    expiresAt: "2025-03-22",
    usedBy: 678,
    moreInfo: "35% rabatt på Apple Watch Series 9 med nya funktioner och design.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-6",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: 'LG OLED B3 55" - 5000 kr rabatt',
    description: "OLED-TV med självlysande pixlar, α7 Gen6 AI-processor och webOS 23.",
    discount: "5000 kr",
    code: "LGOLED5000",
    category: "TV & Ljud",
    expiresAt: "2025-04-01",
    usedBy: 234,
    isFeatured: true,
    moreInfo: '5000 kr rabatt på LG OLED B3 55" med perfekta svärtor och levande färger.',
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-7",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "Sony PlayStation 5 Slim - 1500 kr rabatt",
    description: "Senaste PS5 modellen med 1TB lagring och kompaktare design.",
    discount: "1500 kr",
    code: "PS5SLIM",
    category: "Gaming",
    expiresAt: "2025-03-15",
    usedBy: 1234,
    isTrending: true,
    moreInfo: "1500 kr rabatt på PlayStation 5 Slim med förbättrad design.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-8",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "Microsoft Xbox Series X - 2000 kr rabatt",
    description: "Kraftfull spelkonsol med 4K gaming, ray tracing och Game Pass Ultimate.",
    discount: "2000 kr",
    code: "XBOX2000",
    category: "Gaming",
    expiresAt: "2025-03-31",
    usedBy: 567,
    moreInfo: "2000 kr rabatt på Xbox Series X med topprestanda för 4K gaming.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-9",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "iPad Air 5 - 30% rabatt",
    description: 'Kraftfull surfplatta med M1-chip, 10.9" Liquid Retina display och Apple Pencil-stöd.',
    discount: "30%",
    code: "IPADAIR30",
    category: "Datorer",
    expiresAt: "2025-03-25",
    usedBy: 345,
    moreInfo: "30% rabatt på iPad Air 5 med M1-chip och professionella funktioner.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-10",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "Beats Studio3 Wireless - 50% rabatt",
    description: "Trådlösa hörlurar med Pure ANC, 22 timmars batteritid och Apple W1-chip.",
    discount: "50%",
    code: "BEATS50",
    category: "TV & Ljud",
    expiresAt: "2025-03-20",
    usedBy: 789,
    isTrending: true,
    moreInfo: "50% rabatt på Beats Studio3 Wireless med premium ljudkvalitet.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-11",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "Google Pixel 8 Pro - 2500 kr rabatt",
    description: "AI-driven smartphone med Tensor G3-chip och professionell kamera.",
    discount: "2500 kr",
    code: "PIXEL2500",
    category: "Mobiltelefoner",
    expiresAt: "2025-03-22",
    usedBy: 234,
    moreInfo: "2500 kr rabatt på Google Pixel 8 Pro med avancerade AI-funktioner.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-12",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: 'Samsung 75" Neo QLED - 7000 kr rabatt',
    description: "Premium 75-tums TV med Quantum Matrix Technology och Neural Quantum Processor.",
    discount: "7000 kr",
    code: "NEO7000",
    category: "TV & Ljud",
    expiresAt: "2025-04-05",
    usedBy: 123,
    isFeatured: true,
    moreInfo: '7000 kr rabatt på Samsung 75" Neo QLED med branschledande bildkvalitet.',
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-13",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "JBL PartyBox 310 - 45% rabatt",
    description: "Kraftfull partyhögtalare med RGB-ljus, mikrofon och 18 timmars speltid.",
    discount: "45%",
    code: "PARTY45",
    category: "TV & Ljud",
    expiresAt: "2025-03-31",
    usedBy: 456,
    moreInfo: "45% rabatt på JBL PartyBox 310 för ultimata festupplevelser.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-14",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "OnePlus 11 - 2200 kr rabatt",
    description: "Flaggskeppstelefon med Snapdragon 8 Gen 2, Hasselblad-kamera och 100W laddning.",
    discount: "2200 kr",
    code: "ONEPLUS2200",
    category: "Mobiltelefoner",
    expiresAt: "2025-03-25",
    usedBy: 345,
    moreInfo: "2200 kr rabatt på OnePlus 11 med topprestanda och snabbladdning.",
    offerUrl: "https://cdon.se",
  },
  {
    id: "cdo-15",
    store: "CDON",
    storeLogo: "/images/cdon-logo.png",
    storeHref: "/cdon",
    title: "Garmin Fenix 7 - 40% rabatt",
    description: "Premium sportklocka med GPS, pulsmätare och upp till 18 dagars batteritid.",
    discount: "40%",
    code: "GARMIN40",
    category: "Elektronik",
    expiresAt: "2025-03-20",
    usedBy: 234,
    moreInfo: "40% rabatt på Garmin Fenix 7 för seriösa idrottare och äventyrare.",
    offerUrl: "https://cdon.se",
  },
]

const categories = ["Alla", "Elektronik", "Mobiltelefoner", "TV & Ljud", "Datorer", "Gaming"]
const stores = ["Alla butiker", "Elgiganten", "Power", "NetOnNet", "Webhallen", "Komplett", "CDON"]

export default function RabattkoderPage() {
  const [selectedCategory, setSelectedCategory] = useState("Alla")
  const [selectedStore, setSelectedStore] = useState("Alla butiker")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  const filteredCoupons = allCoupons.filter((coupon) => {
    const matchesCategory = selectedCategory === "Alla" || coupon.category === selectedCategory
    const matchesStore = selectedStore === "Alla butiker" || coupon.store === selectedStore
    const matchesSearch =
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.store.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesStore && matchesSearch
  })

  const featuredCoupons = filteredCoupons.filter((coupon) => coupon.isFeatured)
  const trendingCoupons = filteredCoupons.filter((coupon) => coupon.isTrending && !coupon.isFeatured)
  const regularCoupons = filteredCoupons.filter((coupon) => !coupon.isFeatured && !coupon.isTrending)

  // Calculate real statistics
  const totalOffers = allCoupons.length
  const totalStores = 6
  const highestDiscount = "70%" // Based on iPhone offer
  const lastUpdated = "Idag"

  const handleCouponSelect = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
  }

  const handleModalClose = () => {
    setSelectedCoupon(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Alla Rabattkoder på Ett Ställe</h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Upptäck de bästa erbjudandena från Sveriges populäraste elektronikbutiker
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold">{totalOffers}</div>
                <div className="text-green-100">Aktiva erbjudanden</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold">{totalStores}</div>
                <div className="text-green-100">Butiker</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold">{highestDiscount}</div>
                <div className="text-green-100">Högsta rabatt</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold">{lastUpdated}</div>
                <div className="text-green-100">Senast uppdaterad</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sök rabattkoder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {stores.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Butik</label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {stores.map((store) => (
                    <option key={store} value={store}>
                      {store}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Deals */}
        {featuredCoupons.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Utvalda Erbjudanden</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} onSelect={handleCouponSelect} featured />
              ))}
            </div>
          </section>
        )}

        {/* Trending Deals */}
        {trendingCoupons.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">Populära Just Nu</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} onSelect={handleCouponSelect} />
              ))}
            </div>
          </section>
        )}

        {/* All Deals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Alla Rabattkoder ({filteredCoupons.length})</h2>
          </div>

          {filteredCoupons.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inga rabattkoder hittades</h3>
              <p className="text-gray-600">Prova att ändra dina sökkriterier eller filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...featuredCoupons, ...trendingCoupons, ...regularCoupons].map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} onSelect={handleCouponSelect} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />

      {/* Coupon Modal */}
      {selectedCoupon && (
        <CouponModal
          coupon={{
            id: selectedCoupon.id,
            title: selectedCoupon.title,
            description: selectedCoupon.description,
            discount: selectedCoupon.discount,
            code: selectedCoupon.code,
            uses: selectedCoupon.usedBy,
            type: selectedCoupon.discount.includes("%") ? "percentage" : "amount",
            moreInfo: selectedCoupon.moreInfo,
            expired: false,
            offerUrl: selectedCoupon.offerUrl,
            expirationDate: selectedCoupon.expiresAt,
            store: selectedCoupon.store,
            storeLogo: selectedCoupon.storeLogo,
            storeHref: selectedCoupon.storeHref,
            category: selectedCoupon.category,
          }}
          onClose={handleModalClose}
          storeName={selectedCoupon.store}
        />
      )}
    </div>
  )
}

interface CouponCardProps {
  coupon: Coupon
  onSelect: (coupon: Coupon) => void
  featured?: boolean
}

function CouponCard({ coupon, onSelect, featured = false }: CouponCardProps) {
  const isExpiringSoon = new Date(coupon.expiresAt) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer ${
        featured ? "ring-2 ring-yellow-200" : ""
      }`}
      onClick={() => onSelect(coupon)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <img
                src={coupon.storeLogo || "/placeholder.svg"}
                alt={`${coupon.store} logo`}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{coupon.store}</div>
              <div className="text-sm text-gray-500">{coupon.category}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {coupon.isTrending && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                Populär
              </div>
            )}
            {featured && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                <Star className="w-3 h-3" />
                Utvald
              </div>
            )}
          </div>
        </div>

        {/* Discount Badge */}
        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-lg">
          {coupon.discount} RABATT
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{coupon.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{coupon.description}</p>

        {/* Stats */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{coupon.usedBy.toLocaleString()} använda</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
          {coupon.code ? "Visa rabattkod" : "Få erbjudande"}
        </button>
      </div>
    </div>
  )
}
