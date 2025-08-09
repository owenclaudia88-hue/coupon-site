export const OFFER_REDIRECTS: Record<string, string> = {
  "cdon-001": "https://cdon.se",
  "cdon-002": "https://cdon.se",
  "cdon-003": "https://cdon.se",
  "cdon-004": "https://cdon.se",
  "cdon-005": "https://cdon.se",
  "cdon-006": "https://cdon.se",
  "cdon-007": "https://cdon.se",
  "cdon-008": "https://cdon.se",
  "cdon-009": "https://cdon.se",
  "cdon-010": "https://cdon.se",
  "cdon-011": "https://cdon.se",
  "cdon-012": "https://cdon.se",
  "cdon-013": "https://cdon.se",
  "cdon-014": "https://cdon.se",
  "cdon-015": "https://cdon.se",
  "cdon-special-electronics": "https://cdon.se",

  // expired
  "cdon-exp-001": "https://cdon.se",
  "cdon-exp-002": "https://cdon.se",
  "cdon-exp-003": "https://cdon.se",
  "cdon-exp-004": "https://cdon.se",
  "cdon-exp-005": "https://cdon.se",
  "cdon-exp-006": "https://cdon.se",
  "cdon-exp-007": "https://cdon.se",
  "cdon-exp-008": "https://cdon.se",
}

export function getRedirectUrl(id: string) {
  return OFFER_REDIRECTS[id] ?? null
}
