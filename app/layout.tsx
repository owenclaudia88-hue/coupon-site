import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CookieBanner from "./components/CookieBanner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Elgiganten Rabattkoder - Säkerhetsverifiering",
  description: "Säker verifiering för Elgiganten rabattkoder och erbjudanden",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
