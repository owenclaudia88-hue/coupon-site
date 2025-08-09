// Map Webhallen offer IDs -> final external URLs.
// These are consumed server-side by app/api/get-offer-url/route.ts
export const offerRedirects: Record<string, string> = {
  // Specials / live
  "gaming-computer-special": "https://www.webhallen.com/se/category/8-datorer?campaign=gaming-special",
  "wh-001": "https://www.webhallen.com/se/category/8-datorer?campaign=gaming-laptops",
  "wh-002": "https://www.webhallen.com/se/category/173-spel-dator-tillbehor?campaign=super-sale",
  "wh-003": "https://www.webhallen.com/se/campaign/student",
  "wh-004": "https://www.webhallen.com/se/shipping",
  "wh-005": "https://www.webhallen.com/se/category/45-grafikkort",
  "wh-006": "https://www.webhallen.com/se/category/550-virtual-reality",
  "wh-007": "https://www.webhallen.com/se/category/593-streaming",
  "wh-008": "https://www.webhallen.com/se/category/243-gamingstolar",
  "wh-009": "https://www.webhallen.com/se/category/178-skarmar?tag=gaming",
  "wh-010": "https://www.webhallen.com/se/category/38-spelkonsoler",
  "wh-011": "https://www.webhallen.com/se/build-assembly",
  "wh-012": "https://www.webhallen.com/se/campaign/new-customer",

  // Expired examples (optional, just for parity)
  "wh-exp-001": "https://www.webhallen.com/se/campaign/black-friday",
  "wh-exp-002": "https://www.webhallen.com/se/campaign/cyber-monday",
  "wh-exp-003": "https://www.webhallen.com/se/campaign/summer-sale",
  "wh-exp-004": "https://www.webhallen.com/se/campaign/christmas",
  "wh-exp-005": "https://www.webhallen.com/se/campaign/easter",
};
