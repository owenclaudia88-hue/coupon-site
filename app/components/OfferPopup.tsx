"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface OfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  offer: {
    title: string;
    discount: string;
    description: string;
    offerUrl: string; // points to /elgiganten/verify?... so middleware kicks in
  };
}

export default function OfferPopup({ isOpen, onClose, storeName, offer }: OfferPopupProps) {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  // ---- Fire a conversion WITHOUT redirect (avoid double-counting) ----
  const fireClickConversionNoRedirect = () => {
    try {
      const fn = (window as any)?.gtag_report_conversion;
      if (typeof fn === "function") {
        fn(); // no URL => no redirect
      } else if ((window as any)?.gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-17491126902/AzNoCO-j2IwbEPbUtZRB",
        });
      }
    } catch {
      /* noop */
    }
  };

  // Same redirect behavior so middleware still handles UA/ISP/ASN checks
  const redirectToOffer = () => {
    const dest = offer?.offerUrl || "/";
    onClose();
    setTimeout(() => {
      window.location.href = dest;
    }, 120);
  };

  // Save lead, then go to offer
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email) || sending) return;

    setSending(true);

    try {
      // Try to pull an `id` from the offerUrl if present, otherwise send the title
      let offerId: string | null = null;
      try {
        const u = new URL(offer.offerUrl, window.location.origin);
        offerId = u.searchParams.get("id");
      } catch {
        /* ignore */
      }

      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          offerId: offerId || offer.title,
          store: storeName,
          ts: Date.now(),
        }),
      });
    } catch {
      // ignore network errors – we still allow the user through
    } finally {
      setSending(false);
    }

    // Fire your ad conversion (no redirect) and continue
    fireClickConversionNoRedirect();
    redirectToOffer();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="bg-white rounded-xl w-full max-w-md mx-auto p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          {/* Store Logo */}
          <div className="w-20 h-12 md:w-24 md:h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-200 p-2">
            <img
              src={
                storeName === "Power"
                  ? "https://media.power-cdn.net/images/logos/powerse/logo.svg"
                  : storeName === "NetOnNet"
                  ? "/images/netonnet-logo.svg"
                  : storeName === "Webhallen"
                  ? "/images/webhallen-logo.png"
                  : storeName === "Komplett"
                  ? "/images/komplett-logo.svg"
                  : storeName === "CDON"
                  ? "/images/cdon-logo.png"
                  : "/images/elgiganten-logo.svg"
              }
              alt={`${storeName} Logo`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Main Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Såg du detta erbjudande än?</h2>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6 text-sm">
            Kunder har nyligen tagit detta erbjudande — missa inte!
          </p>

          {/* Current Offer */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aktuellt erbjudande:</h3>
            <p className="text-blue-700 font-semibold text-base mb-2">{offer.title}</p>
            <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
            <p className="text-green-700 font-medium text-sm">
              Rabatten tillämpas automatiskt vid kassan.
            </p>
          </div>

          {/* Email gate (added) */}
          <form onSubmit={handleUnlock} className="mb-4 space-y-3 text-left">
            <p className="text-sm text-gray-700">
              För att låsa upp rabatten, ange din e-postadress nedan. Du skickas sedan vidare till
              erbjudandet.
            </p>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ange din e-postadress"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              required
            />

            {/* Use Discount Button (submit) */}
            <button
              type="submit"
              disabled={!isValidEmail(email) || sending}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors text-base ${
                !isValidEmail(email) || sending
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Använd rabatt
            </button>
          </form>

          {/* Cute Character Illustration */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎉</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
