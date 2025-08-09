export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return new Response("Missing id", { status: 400 })

  const DEST: Record<string, string> = {
    // Active (from /cdon/page.tsx)
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

    // Expired
    "cdon-exp-001": "https://cdon.se",
    "cdon-exp-002": "https://cdon.se",
    "cdon-exp-003": "https://cdon.se",
    "cdon-exp-004": "https://cdon.se",
    "cdon-exp-005": "https://cdon.se",
    "cdon-exp-006": "https://cdon.se",
    "cdon-exp-007": "https://cdon.se",
    "cdon-exp-008": "https://cdon.se",
  }

  const to = DEST[id]
  if (!to) return new Response("Unknown offer id", { status: 404 })

  const html = `<!doctype html><meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(
    to,
  )})</script><a href="${to}">Fortsätt</a>`
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } })
}
