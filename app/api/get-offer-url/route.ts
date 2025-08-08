import { NextResponse } from 'next/server'

const offerUrls: { [key: string]: string } = {
  'iphone-16-pro-max': 'https://elgiganten24.shop/',
  'elg-001': 'https://www.elgiganten.se/all-products-sale',
  'elg-002': 'https://www.elgiganten.se/super-sale',
  'elg-003': 'https://www.elgiganten.se/student-discount',
  'free-shipping': 'https//:www.elgiganten.se/free-shipping',
  'elg-005': 'https://www.elgiganten.se/tv-discount',
  'elg-006': 'https://www.elgiganten.se/home-appliances-sale',
  'elg-007': 'https://www.elgiganten.se/computers-discount',
  'elg-008': 'https://www.elgiganten.se/gaming-accessories-sale',
  'elg-009': 'https://www.elgiganten.se/extra-discount-clearance',
  'elg-010': 'https://www.elgiganten.se/smartphones-sale',
  'elg-011': 'https://www.elgiganten.se/free-installation-appliances',
  'elg-012': 'https://www.elgiganten.se/new-customer-discount',
  'elg-exp-001': 'https://www.elgiganten.se/expired/black-friday-tv',
  'elg-exp-002': 'https://www.elgiganten.se/expired/christmas-shipping',
  'elg-exp-003': 'https://www.elgiganten.se/expired/summer-ac-sale',
  'elg-exp-004': 'https://www.elgiganten.se/expired/cyber-monday-gaming',
  'elg-exp-005': 'https://www.elgiganten.se/expired/easter-kitchen-sale',
  'elg-exp-006': 'https://www.elgiganten.se/expired/newyear-audio-sale',
  'elg-exp-007': 'https://www.elgiganten.se/expired/midsummer-delivery'
  // Add other ID-URL pairs here
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id || !offerUrls[id]) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json({ url: offerUrls[id] })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}




