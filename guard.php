<?php
/**
 * REFERENCE FILE — the logic from this file has been ported into middleware.ts
 * for the Next.js deployment on discountnation.online.
 *
 * This file documents all the security checks that guard.php performs.
 * The equivalent TypeScript checks run in Next.js middleware before
 * any page content is served.
 *
 * Checks ported to middleware.ts:
 *   1. Bot UA pattern matching
 *   2. Header sanity (missing UA / Accept-Language)
 *   3. CIDR blocking (Google, Meta, AWS, GCP, etc.)
 *   4. IPinfo Lite API — ASN + provider name blocking
 *   5. Country allow-list (JP, RO, TH via env ALLOWED_COUNTRIES)
 *   6. MaxMind secondary ISP lookup
 *
 * Checks NOT ported (edge runtime limitations):
 *   - Reverse DNS (gethostbyaddr not available in edge)
 *   - File-based rate limiting (no filesystem in edge)
 *   - Cloak token (not needed — middleware rewrites instead)
 *   - MMDB file lookups (replaced by IPinfo API + MaxMind API route)
 */
