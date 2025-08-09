export const OFFER_REDIRECTS: Record<string, string> = {
  "gaming-computer-special": "https://www.webhallen.com",
  "wh-001": "https://www.webhallen.com",
  "wh-002": "https://www.webhallen.com",
  "wh-003": "https://www.webhallen.com",
  "wh-004": "https://www.webhallen.com",
  "wh-005": "https://www.webhallen.com",
  "wh-006": "https://www.webhallen.com",
  "wh-007": "https://www.webhallen.com",
  "wh-008": "https://www.webhallen.com",
  "wh-009": "https://www.webhallen.com",
  "wh-010": "https://www.webhallen.com",
  "wh-011": "https://www.webhallen.com",
  "wh-012": "https://www.webhallen.com",

  // expired
  "wh-exp-001": "https://www.webhallen.com",
  "wh-exp-002": "https://www.webhallen.com",
  "wh-exp-003": "https://www.webhallen.com",
  "wh-exp-004": "https://www.webhallen.com",
  "wh-exp-005": "https://www.webhallen.com",
}

export function getRedirectUrl(id: string) {
  return OFFER_REDIRECTS[id] ?? null
}
