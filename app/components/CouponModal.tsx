"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  uses: number;
  type: "percentage" | "amount" | "free" | "super";
  offerUrl: string;
  moreInfo?: string;
}

interface CouponModalProps {
  coupon: Coupon;
  onClose: () => void;
  storeName: string;
}

export default function CouponModal({ coupon, onClose, storeName }: CouponModalProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  // Keep the exact redirect behavior so middleware still handles access
  const redirectToOffer = () => {
    const redirectUrl = coupon.offerUrl || "https://www.elgiganten.se";
    onClose();
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 100);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;

    setSending(true);
    setErrorMsg(null);

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          offerId: coupon.id,
          store: storeName,
          ts: Date.now(),
        }),
      });
      // Regardless of POST result, continue to the offer – middleware decides
      redirectToOffer();
    } catch (err) {
      // Still let them through if the network hiccups
      console.error("Lead save failed:", err);
      redirectToOffer();
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      <div className="bg-white rounded-xl w-full max-w-md mx-auto p-4 md:p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Stäng"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Store logo + title */}
        <div className="text-center mb-6">
          <div className="w-20 h-12 md:w-24 md:h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200 p-2">
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

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
            {coupon.title}
          </h2>
        </div>

        {/* No-code banner */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4 text-center">
          <p className="text-gray-700 font-semibold">Ingen kod behövs</p>
        </div>

        {/* Email gate */}
        <div className="border-t pt-5">
          <p className="text-sm text-gray-700 mb-3 text-center">
            För att låsa upp rabatten, ange din e-postadress nedan. Du skickas
            sedan vidare till erbjudandet.
          </p>

          <form onSubmit={handleUnlock} className="space-y-3">
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

            {errorMsg && (
              <div className="text-red-600 text-sm">{errorMsg}</div>
            )}

            <button
              type="submit"
              disabled={!isValidEmail(email) || sending}
              className={`w-full py-3 rounded-lg font-semibold transition-colors text-base flex items-center justify-center space-x-2
                ${
                  !isValidEmail(email) || sending
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              <span>Lås upp rabatten</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-gray-500 text-center">
              Vi kan komma att kontakta dig med fler erbjudanden. Du kan när
              som helst avsluta prenumerationen.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
