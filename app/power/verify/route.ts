export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return new Response("Missing id", { status: 400 })

  const DEST: Record<string, string> = {
    // Active (from /power/page.tsx)
    "power-001": "https://www.power.se",
    "power-002": "https://www.power.se",
    "power-003": "https://www.power.se",
    "power-004": "https://www.power.se",
    "power-005": "https://www.power.se",
    "power-006": "https://www.power.se",
    "power-007": "https://www.power.se",
    "power-008": "https://www.power.se",
    "power-009": "https://www.power.se",
    "power-010": "https://www.power.se",
    "power-011": "https://www.power.se",
    "power-012": "https://www.power.se",

    // Expired (optional to keep)
    "power-exp-001": "https://www.power.se",
    "power-exp-002": "https://www.power.se",
  }

  const to = DEST[id]
  if (!to) return new Response("Unknown offer id", { status: 404 })

  const html = `<!doctype html><meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(
    to,
  )})</script><a href="${to}">Fortsätt</a>`
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } })
}
