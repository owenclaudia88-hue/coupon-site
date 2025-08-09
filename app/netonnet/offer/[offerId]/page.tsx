'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function OfferPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.offerId as string;

  useEffect(() => {
    const t = setTimeout(() => router.push('/netonnet'), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">NetOnNet Erbjudande</h1>
        <p className="text-gray-600 mb-4">Erbjudande ID: {offerId}</p>
        <p className="text-sm text-gray-500">Omdirigerar tillbaka till huvudsidan...</p>
      </div>
    </div>
  );
}
