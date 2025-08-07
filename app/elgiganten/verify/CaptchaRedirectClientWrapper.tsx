"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CaptchaRedirectClientWrapper({ offerId }: { offerId: string }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleCaptchaSuccess = async () => {
    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch(`/api/offer-redirect?id=${offerId}`);
      if (!res.ok) throw new Error("Kunde inte hämta omdirigeringslänken");

      const data = await res.json();

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("Ingen omdirigeringslänk hittades");
      }
    } catch (err: any) {
      console.error(err);
      setError("Något gick fel. Försök igen.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-700 mb-4">
        Vänligen slutför verifieringen nedan för att fortsätta till erbjudandet.
      </p>

      {/* Your slider or CAPTCHA component here */}
      <button
        onClick={handleCaptchaSuccess}
        disabled={isVerifying}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        {isVerifying ? "Verifierar..." : "Jag är inte en robot"}
      </button>

      {error && <p className="text-red-500 mt-3 text-sm text-center">{error}</p>}
    </div>
  );
}
