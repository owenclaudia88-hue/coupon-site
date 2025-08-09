"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CaptchaRedirectClientWrapper() {
  const params = useSearchParams();
  const offerId = params.get("id");

  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We auto-verify here; the CaptchaRedirect component will set this
  // for you if you prefer to gate it behind the puzzle. If you want
  // the puzzle, lift state or trigger `setVerified(true)` from there.
  useEffect(() => {
    setVerified(true);
  }, []);

  useEffect(() => {
    if (!verified || !offerId) return;

    fetch("/api/get-offer-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // pass store to be explicit; referrer inference also works
      body: JSON.stringify({ id: offerId, store: "power" }),
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
