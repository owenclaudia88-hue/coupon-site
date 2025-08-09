export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return new Response("Missing id", { status: 400 })

  const DEST: Record<string, string> = {
    // Active
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

    // Expired
    "non-exp-001": "https://www.netonnet.se",
    "non-exp-002": "https://www.netonnet.se",
    "non-exp-003": "https://www.netonnet.se",
    "non-exp-004": "https://www.netonnet.se",
    "non-exp-005": "https://www.netonnet.se",
  }

  const to = DEST[id]
  if (!to) return new Response("Unknown offer id", { status: 404 })

  const html = `<!doctype html><meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(
    to,
  )})</script><a href="${to}">Fortsätt</a>`
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } })
}
