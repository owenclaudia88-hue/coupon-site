'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CaptchaRedirectClientWrapper() {
  const searchParams = useSearchParams();
  const offerId = searchParams.get('id');

  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For now we auto-verify (same as Elgiganten) to keep flow snappy.
  useEffect(() => {
    setVerified(true);
  }, []);

  useEffect(() => {
    if (verified && offerId) {
      fetch('/api/get-offer-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // NOTE: include the store so the API knows which mapping to use
        body: JSON.stringify({ id: offerId, store: 'komplett' }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Offer not found');
          return res.json();
        })
        .then((data) => {
          setTimeout(() => {
            window.location.href = data.url;
          }, 300);
        })
        .catch(() => setError('Kunde inte ladda erbjudandet.'));
    }
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
