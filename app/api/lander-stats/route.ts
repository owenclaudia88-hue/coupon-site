import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const PASSWORD = process.env.SHIELD_LOG_PASSWORD || "shieldpass123";
const COOKIE_NAME = "lander_auth";

const KEYS = {
  views:     "lander_elgiganten_views",
  checkouts: "lander_elgiganten_checkouts",
  events:    "lander_elgiganten_events",
};

function authToken() {
  let h = 0;
  const s = "lander:" + PASSWORD;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return "ltk_" + (h >>> 0).toString(36);
}

function isAuthed(req: NextRequest) {
  return req.cookies.get(COOKIE_NAME)?.value === authToken();
}

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

const NO_INDEX: Record<string, string> = {
  "content-type": "text/html",
  "x-robots-tag": "noindex, nofollow, noarchive, nosnippet",
  "cache-control": "no-store, no-cache, must-revalidate, private",
};

/* ─── POST: record event (from lander page JS) ─────────────────────────── */
export async function POST(req: NextRequest) {
  // Login form
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const formData = await req.formData();
    const action = formData.get("action");
    if (action === "login") {
      const pw = formData.get("pw") as string;
      if (pw === PASSWORD) {
        const res = NextResponse.redirect(new URL("/api/lander-stats", req.url), { status: 303 });
        res.cookies.set(COOKIE_NAME, authToken(), {
          httpOnly: true, secure: true, sameSite: "strict",
          path: "/api/lander-stats", maxAge: 60 * 60 * 24,
        });
        return res;
      }
      return new NextResponse(loginHTML("Wrong password"), { headers: NO_INDEX });
    }
    if (action === "logout") {
      const res = NextResponse.redirect(new URL("/api/lander-stats", req.url), { status: 303 });
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
    if (action === "clear" && isAuthed(req)) {
      const redis = getRedis();
      await redis.del(KEYS.views, KEYS.checkouts, KEYS.events);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // Event ping from lander (x-lander-event header)
  const event = req.headers.get("x-lander-event");
  if (event === "view" || event === "checkout") {
    try {
      const redis = getRedis();
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                 req.headers.get("x-real-ip") || "";
      const ua = req.headers.get("user-agent") || "";
      const pipeline = redis.pipeline();
      pipeline.incr(event === "view" ? KEYS.views : KEYS.checkouts);
      pipeline.rpush(KEYS.events, JSON.stringify({ ts: Date.now(), event, ip, ua: ua.slice(0, 120) }));
      pipeline.ltrim(KEYS.events, -2000, -1);
      await pipeline.exec();
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "bad request" }, { status: 400 });
}

/* ─── GET: viewer or JSON data ──────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return new NextResponse(loginHTML(), { headers: NO_INDEX });
  }

  const url = new URL(req.url);
  if (url.searchParams.get("format") === "json") {
    try {
      const redis = getRedis();
      const perPage = Math.min(parseInt(url.searchParams.get("per_page") || "50"), 200);
      const page = Math.max(parseInt(url.searchParams.get("page") || "1"), 1);
      const eventFilter = url.searchParams.get("event") || "all"; // "view" | "checkout" | "all"

      const [views, checkouts, allRaw] = await Promise.all([
        redis.get(KEYS.views),
        redis.get(KEYS.checkouts),
        redis.lrange(KEYS.events, -2000, -1),
      ]);

      // Parse and apply event filter
      let allEvents = ((allRaw || []) as string[]).map((r) => {
        try { return typeof r === "string" ? JSON.parse(r) : r; } catch { return r; }
      }).reverse(); // newest first

      if (eventFilter === "view" || eventFilter === "checkout") {
        allEvents = allEvents.filter((e: any) => e.event === eventFilter);
      }

      const total = allEvents.length;
      const totalPages = Math.max(1, Math.ceil(total / perPage));
      const safePage = Math.min(page, totalPages);
      const events = allEvents.slice((safePage - 1) * perPage, safePage * perPage);

      return NextResponse.json({
        views: Number(views) || 0,
        checkouts: Number(checkouts) || 0,
        events,
        total,
        page: safePage,
        totalPages,
        perPage,
      });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  return new NextResponse(viewerHTML(), { headers: NO_INDEX });
}

/* ─── Login HTML ────────────────────────────────────────────────────────── */
function loginHTML(error = "") {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Lander Stats</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif}
.card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:2rem;width:100%;max-width:360px}
h2{color:#f1f5f9;font-size:1.4rem;margin-bottom:1.5rem;text-align:center}
input{width:100%;padding:.75rem 1rem;border-radius:8px;border:1px solid #475569;background:#0f172a;color:#f1f5f9;font-size:1rem;margin-bottom:1rem}
button{width:100%;padding:.75rem;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer}
button:hover{background:#4f46e5}
.err{color:#f87171;font-size:.9rem;margin-bottom:1rem;text-align:center}
</style></head><body>
<div class="card">
  <h2>Lander Stats</h2>
  ${error ? `<p class="err">${error}</p>` : ""}
  <form method="POST" action="/api/lander-stats" enctype="application/x-www-form-urlencoded">
    <input type="hidden" name="action" value="login"/>
    <input type="password" name="pw" placeholder="Password" autofocus/>
    <button type="submit">Login</button>
  </form>
</div>
</body></html>`;
}

/* ─── Viewer HTML ───────────────────────────────────────────────────────── */
function viewerHTML() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Lander Stats</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0f172a;color:#e2e8f0;font-family:system-ui,sans-serif;min-height:100vh}
header{background:#1e293b;border-bottom:1px solid #334155;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem}
.logo{display:flex;align-items:center;gap:.75rem}
.logo-icon{background:#6366f1;border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:1.1rem}
.logo h1{font-size:1.1rem;font-weight:700;color:#f1f5f9}
.logo p{font-size:.75rem;color:#94a3b8}
.btns{display:flex;gap:.5rem;flex-wrap:wrap}
.btn{padding:.45rem 1rem;border-radius:6px;border:none;font-size:.85rem;font-weight:600;cursor:pointer}
.btn-grey{background:#334155;color:#e2e8f0}.btn-grey:hover{background:#475569}
.btn-red{background:#dc2626;color:#fff}.btn-red:hover{background:#b91c1c}
main{padding:1.5rem;max-width:1200px;margin:0 auto}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem}
.stat-card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:1.5rem;text-align:center}
.stat-label{font-size:.8rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem}
.stat-value{font-size:2.5rem;font-weight:800;color:#f1f5f9}
.stat-value.green{color:#4ade80}
.stat-value.blue{color:#60a5fa}
.stat-value.yellow{color:#fbbf24}
.stat-sub{font-size:.8rem;color:#64748b;margin-top:.25rem}
.section-title{font-size:1rem;font-weight:700;color:#f1f5f9;margin-bottom:.75rem}
table{width:100%;border-collapse:collapse;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155}
th{background:#0f172a;padding:.6rem .75rem;text-align:left;font-size:.75rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;font-weight:600}
td{padding:.6rem .75rem;font-size:.82rem;border-top:1px solid #1e293b;color:#cbd5e1;vertical-align:top}
tr:hover td{background:#1e3a5f22}
.badge{display:inline-block;padding:.2rem .55rem;border-radius:999px;font-size:.72rem;font-weight:700}
.badge-view{background:#1e40af33;color:#60a5fa;border:1px solid #1e40af}
.badge-checkout{background:#16653433;color:#4ade80;border:1px solid #166534}
.info{color:#64748b;font-size:.85rem;font-style:italic}
#status{font-size:.8rem;color:#94a3b8;padding:.25rem 0}
.auto-ref{display:flex;align-items:center;gap:.5rem;font-size:.82rem;color:#94a3b8}
</style></head><body>
<header>
  <div class="logo">
    <div class="logo-icon">📊</div>
    <div>
      <h1>Lander Analytics</h1>
      <p>Elgiganten prelander — real user tracking</p>
    </div>
  </div>
  <div class="btns">
    <div class="auto-ref">
      <input type="checkbox" id="autoref" checked style="accent-color:#6366f1"/>
      <label for="autoref">Auto-refresh (30s)</label>
    </div>
    <button class="btn btn-grey" onclick="loadStats()">Refresh</button>
    <button class="btn btn-red" onclick="clearStats()">Clear Stats</button>
    <form method="POST" action="/api/lander-stats" enctype="application/x-www-form-urlencoded" style="display:inline">
      <input type="hidden" name="action" value="logout"/>
      <button type="submit" class="btn btn-grey">Logout</button>
    </form>
  </div>
</header>
<main>
  <div id="status" style="margin-bottom:1rem"></div>
  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Lander Views</div>
      <div class="stat-value blue" id="s-views">—</div>
      <div class="stat-sub">Real users who saw the prelander</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Checkout Clicks</div>
      <div class="stat-value green" id="s-checkouts">—</div>
      <div class="stat-sub">Clicked Fortsätt → eliteshaveclub.com</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Click-Through Rate</div>
      <div class="stat-value yellow" id="s-ctr">—</div>
      <div class="stat-sub">Checkouts ÷ Views</div>
    </div>
  </div>

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:.5rem">
    <div style="display:flex;align-items:center;gap:.5rem">
      <span class="section-title" style="margin-bottom:0">Events</span>
      <select id="filter-event" style="background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:.25rem .5rem;border-radius:6px;font-size:.82rem">
        <option value="all">All events</option>
        <option value="view">👁 Views only</option>
        <option value="checkout">✅ Checkouts only</option>
      </select>
    </div>
    <div style="display:flex;align-items:center;gap:.5rem;font-size:.82rem;color:#94a3b8">
      Rows per page:
      <select id="per-page" style="background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:.25rem .5rem;border-radius:6px;font-size:.82rem">
        <option value="25">25</option>
        <option value="50" selected>50</option>
        <option value="100">100</option>
      </select>
      <span id="page-info"></span>
    </div>
  </div>
  <table>
    <thead><tr>
      <th>#</th><th>Time</th><th>Event</th><th>IP</th><th>User Agent</th>
    </tr></thead>
    <tbody id="tbl-body">
      <tr><td colspan="5" class="info" style="padding:1.5rem;text-align:center">Loading…</td></tr>
    </tbody>
  </table>
  <div id="pagination" style="display:flex;align-items:center;justify-content:center;gap:.4rem;margin-top:1rem;flex-wrap:wrap"></div>
</main>
<script>
let autoTimer = null;
let currentPage = 1;

function fmt(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

function perPage() {
  return parseInt(document.getElementById('per-page').value);
}

function filterEvent() {
  return document.getElementById('filter-event').value;
}

function renderPagination(totalPages, page, total) {
  const el = document.getElementById('pagination');
  document.getElementById('page-info').textContent = \`\${total.toLocaleString()} total\`;
  if (totalPages <= 1) { el.innerHTML = ''; return; }
  const btn = (label, p, disabled, active) =>
    \`<button onclick="goPage(\${p})" style="padding:.3rem .65rem;border-radius:5px;border:1px solid \${active?'#6366f1':'#334155'};background:\${active?'#6366f1':'#1e293b'};color:\${active?'#fff':'#e2e8f0'};font-size:.8rem;cursor:\${disabled?'default':'pointer'};opacity:\${disabled?0.4:1}" \${disabled?'disabled':''}>\${label}</button>\`;
  let html = btn('«', 1, page===1, false) + btn('‹', page-1, page===1, false);
  const delta = 2;
  for (let p = 1; p <= totalPages; p++) {
    if (p===1 || p===totalPages || (p>=page-delta && p<=page+delta)) {
      html += btn(p, p, false, p===page);
    } else if (p===page-delta-1 || p===page+delta+1) {
      html += \`<span style="color:#475569;padding:0 .2rem">…</span>\`;
    }
  }
  html += btn('›', page+1, page===totalPages, false) + btn('»', totalPages, page===totalPages, false);
  el.innerHTML = html;
}

async function loadStats() {
  document.getElementById('status').textContent = 'Loading…';
  try {
    const ef = filterEvent();
    const r = await fetch(\`/api/lander-stats?format=json&page=\${currentPage}&per_page=\${perPage()}\${ef !== 'all' ? '&event=' + ef : ''}\`);
    const d = await r.json();
    if (d.error) { document.getElementById('status').textContent = 'Error: ' + d.error; return; }
    document.getElementById('s-views').textContent = d.views.toLocaleString();
    document.getElementById('s-checkouts').textContent = d.checkouts.toLocaleString();
    const ctr = d.views > 0 ? ((d.checkouts / d.views) * 100).toFixed(1) + '%' : '—';
    document.getElementById('s-ctr').textContent = ctr;

    const tbody = document.getElementById('tbl-body');
    if (!d.events || d.events.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="info" style="padding:1.5rem;text-align:center">No events yet</td></tr>';
    } else {
      const offset = (d.page - 1) * d.perPage;
      tbody.innerHTML = d.events.map((e, i) => \`<tr>
        <td>\${offset + i + 1}</td>
        <td>\${fmt(e.ts)}</td>
        <td><span class="badge \${e.event === 'view' ? 'badge-view' : 'badge-checkout'}">\${e.event === 'view' ? '👁 view' : '✅ checkout'}</span></td>
        <td>\${e.ip || '—'}</td>
        <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${e.ua || '—'}</td>
      </tr>\`).join('');
    }
    renderPagination(d.totalPages, d.page, d.total);
    document.getElementById('status').textContent = 'Last updated: ' + new Date().toLocaleTimeString('sv-SE');
  } catch (e) {
    document.getElementById('status').textContent = 'Load error: ' + e.message;
  }
}

function goPage(p) {
  currentPage = p;
  loadStats();
}

async function clearStats() {
  if (!confirm('Clear all lander stats? This cannot be undone.')) return;
  const fd = new FormData();
  fd.append('action', 'clear');
  await fetch('/api/lander-stats', { method: 'POST', body: new URLSearchParams(fd) });
  currentPage = 1;
  loadStats();
}

function setupAutoRefresh() {
  clearInterval(autoTimer);
  if (document.getElementById('autoref').checked) {
    autoTimer = setInterval(loadStats, 30000);
  }
}
document.getElementById('autoref').addEventListener('change', setupAutoRefresh);
document.getElementById('per-page').addEventListener('change', () => { currentPage = 1; loadStats(); });
document.getElementById('filter-event').addEventListener('change', () => { currentPage = 1; loadStats(); });
setupAutoRefresh();
loadStats();
</script>
</body></html>`;
}
