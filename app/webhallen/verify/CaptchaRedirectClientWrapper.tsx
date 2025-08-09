"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CaptchaRedirectClientWrapper() {
  const searchParams = useSearchParams();
  const offerId = searchParams.get("id");

  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bypass captcha UI (same pattern you used on Elgiganten)
  useEffect(() => {
    setVerified(true);
  }, []);

  useEffect(() => {
    if (!verified || !offerId) return;

    // Ask the shared API to resolve the final URL, scoping to the webhallen map
    fetch("/api/get-offer-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: offerId, store: "webhallen" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Offer not found");
        return res.json();
      })
      .then((data) => {
        setTimeout(() => {
          window.location.href = data.url;
        }, 300);
      })
      .catch(() => setError("Kunde inte ladda erbjudandet."));
  }, [verified, offerId]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-[150px]">
      <p>Kontrollerar erbjudandet...</p>
    </div>
  );
}
