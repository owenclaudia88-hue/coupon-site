import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CaptchaRedirectClientWrapper from "./CaptchaRedirectClientWrapper";
import Script from "next/script";

// Fires the Google Ads "Outbound click" conversion only on
// /elgiganten/verify?id=iphone-16-pro-max
export default function VerifyPage({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  const shouldFire =
    (searchParams?.id || "").toLowerCase() === "iphone-16-pro-max";

  return (
    <>
      {shouldFire && (
        <Script id="aw-outbound-iphone" strategy="afterInteractive">
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
        </div>
      </main>
      <Footer />
    </>
  );
}
