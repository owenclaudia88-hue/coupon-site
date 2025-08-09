export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return new Response("Missing id", { status: 400 })

  const DEST: Record<string, string> = {
    // Active
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

    // Expired
    "wh-exp-001": "https://www.webhallen.com",
    "wh-exp-002": "https://www.webhallen.com",
    "wh-exp-003": "https://www.webhallen.com",
    "wh-exp-004": "https://www.webhallen.com",
    "wh-exp-005": "https://www.webhallen.com",
  }

  const to = DEST[id]
  if (!to) return new Response("Unknown offer id", { status: 404 })

  const html = `<!doctype html><meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(
    to,
  )})</script><a href="${to}">Fortsätt</a>`
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } })
}
