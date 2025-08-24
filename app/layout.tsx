import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CookieBanner from "./components/CookieBanner"
import ScrollToTop from "./components/ScrollToTop"

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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-111111111111"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-11111111111');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <CookieBanner />
        <ScrollToTop />
      </body>
    </html>
  )
}
