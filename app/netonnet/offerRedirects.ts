export const OFFER_REDIRECTS: Record<string, string> = {
  "macbook-air-special": "https://www.netonnet.se",
  "non-001": "https://www.netonnet.se",
  "non-002": "https://www.netonnet.se",
  "non-003": "https://www.netonnet.se",
  "non-004": "https://www.netonnet.se",
  "non-005": "https://www.netonnet.se",
  "non-006": "https://www.netonnet.se",
  "non-007": "https://www.netonnet.se",
  "non-008": "https://www.netonnet.se",
  "non-009": "https://www.netonnet.se",
  "non-010": "https://www.netonnet.se",
  "non-011": "https://www.netonnet.se",
  "non-012": "https://www.netonnet.se",

  // expired
  "non-exp-001": "https://www.netonnet.se",
  "non-exp-002": "https://www.netonnet.se",
  "non-exp-003": "https://www.netonnet.se",
  "non-exp-004": "https://www.netonnet.se",
  "non-exp-005": "https://www.netonnet.se",
}

export function getRedirectUrl(id: string) {
  return OFFER_REDIRECTS[id] ?? null
}
