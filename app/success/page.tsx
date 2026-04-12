'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const params = useSearchParams();
  const value    = params.get('value')    || '20';
  const currency = params.get('currency') || 'SEK';

  useEffect(() => {
    // Initialize + fire Facebook Purchase pixel
    try {
      const w = window as any;
      if (!w.fbq) {
        // Inject pixel base code if not already loaded
        const n: any = w.fbq = function(...args: any[]) {
          n.callMethod ? n.callMethod(...args) : n.queue.push(args);
        };
        if (!w._fbq) w._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        const t = document.createElement('script');
        t.async = true;
        t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(t);
      }
      w.fbq('init', '932602642423993');
      w.fbq('track', 'Purchase', {
        value:    parseFloat(value),
        currency: currency,
      });
    } catch (e) {}

    // Track in lander stats
    try {
      fetch('/api/lander-stats', {
        method: 'POST',
        headers: { 'x-lander-event': 'purchase' },
      });
    } catch (e) {}
  }, [value, currency]);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f0fdf4',
      minHeight:  '100vh',
      display:    'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding:    '24px 16px',
    }}>
      <div style={{
        background:   '#fff',
        borderRadius: '20px',
        boxShadow:    '0 8px 40px rgba(0,0,0,0.12)',
        width:        '100%',
        maxWidth:     '480px',
        overflow:     'hidden',
        textAlign:    'center',
      }}>
        {/* Green header */}
        <div style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', padding: '32px 24px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
          }}>✓</div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>
            Betalning bekräftad!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: 0 }}>
            Tack för din beställning
          </p>
        </div>

        {/* Order summary */}
        <div style={{ padding: '24px' }}>
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: '14px', padding: '16px', marginBottom: '20px',
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Din beställning</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#111827' }}>iPhone 17 Pro Max</div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#16a34a', marginTop: '4px' }}>
              {value} {currency}
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, marginBottom: '16px' }}>
            Du får ett bekräftelsemejl inom kort med alla uppgifter om din beställning och leverans.
          </p>

          <div style={{
            background: '#f8fafc', borderRadius: '12px', padding: '14px',
            fontSize: '13px', color: '#6b7280', lineHeight: 1.6,
          }}>
            📦 <strong style={{ color: '#374151' }}>Gratis 2-dagars frakt</strong> — levereras direkt hem till dig
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
