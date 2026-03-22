import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const PASSWORD = process.env.SHIELD_LOG_PASSWORD || "shieldpass123";
const REDIS_KEY = "shield_logs";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

// POST — receive a log entry from middleware
export async function POST(req: NextRequest) {
  if (req.headers.get("x-mw") !== "1") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const entry = await req.json();
    const redis = getRedis();
    // Push to end of list — all logs kept, never deleted
    await redis.rpush(REDIS_KEY, JSON.stringify(entry));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[shield-log] POST error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET — serve the log viewer HTML or JSON data
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pw = url.searchParams.get("pw");

  if (pw !== PASSWORD) {
    return new NextResponse(
      `<!DOCTYPE html><html><head><title>Shield Log</title></head><body style="background:#1a1a2e;color:#eee;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
      <form method="get" style="text-align:center;">
        <h2>Shield Log Viewer</h2>
        <input name="pw" type="password" placeholder="Password" style="padding:10px;font-size:16px;background:#16213e;color:#eee;border:1px solid #0f3460;border-radius:6px;"/><br/><br/>
        <button type="submit" style="padding:10px 30px;background:#e94560;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:16px;">Login</button>
      </form></body></html>`,
      { headers: { "content-type": "text/html" } }
    );
  }

  // If ?format=json, return raw JSON
  if (url.searchParams.get("format") === "json") {
    try {
      const redis = getRedis();
      const raw: string[] = await redis.lrange(REDIS_KEY, 0, -1);
      const logs = raw.map((r) => {
        try { return typeof r === "string" ? JSON.parse(r) : r; }
        catch { return r; }
      });
      return NextResponse.json(logs);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Serve the log viewer HTML
  return new NextResponse(buildViewerHTML(PASSWORD), {
    headers: { "content-type": "text/html" },
  });
}

function buildViewerHTML(pw: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Shield Log Viewer</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0f0f1a; color: #e0e0e0; font-family: 'Segoe UI', monospace; padding: 20px; }
h1 { color: #e94560; margin-bottom: 20px; font-size: 24px; }
.stats { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 20px; }
.stat-card { background: #16213e; border: 1px solid #0f3460; border-radius: 10px; padding: 18px 24px; min-width: 150px; }
.stat-card .label { font-size: 12px; color: #888; text-transform: uppercase; }
.stat-card .value { font-size: 28px; font-weight: bold; margin-top: 4px; }
.stat-card .value.green { color: #4ecca3; }
.stat-card .value.red { color: #e94560; }
.stat-card .value.blue { color: #4ea8de; }
.stat-card .value.yellow { color: #f5a623; }
.panels { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 20px; }
.panel { background: #16213e; border: 1px solid #0f3460; border-radius: 10px; padding: 16px; flex: 1; min-width: 250px; max-height: 200px; overflow-y: auto; }
.panel h3 { color: #e94560; font-size: 14px; margin-bottom: 10px; }
.panel-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; border-bottom: 1px solid #1a1a3e; }
.panel-row .cnt { color: #4ecca3; font-weight: bold; }
.filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px; align-items: center; }
.filters select, .filters input { background: #16213e; color: #e0e0e0; border: 1px solid #0f3460; padding: 8px 12px; border-radius: 6px; font-size: 14px; }
.filters button { background: #e94560; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 14px; }
.filters button:hover { background: #c73a52; }
.filters button.secondary { background: #0f3460; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
thead th { background: #16213e; color: #4ea8de; padding: 10px 8px; text-align: left; position: sticky; top: 0; }
tbody tr { border-bottom: 1px solid #1a1a3e; cursor: pointer; transition: background 0.15s; }
tbody tr:hover { background: #1a1a3e; }
tbody td { padding: 8px; vertical-align: top; }
.verdict-allowed { color: #4ecca3; font-weight: bold; }
.verdict-blocked { color: #e94560; font-weight: bold; }
.detail-row { display: none; }
.detail-row.open { display: table-row; }
.detail-row td { background: #111127; padding: 12px 20px; }
.detail-content { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; }
.detail-content .dk { color: #888; }
.detail-content .dv { color: #ccc; word-break: break-all; }
.refresh-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.auto-label { font-size: 12px; color: #888; }
.log-count { font-size: 12px; color: #666; margin-left: auto; }
</style>
</head>
<body>
<h1>Shield Log Viewer</h1>
<div class="stats" id="stats"></div>
<div class="panels" id="panels"></div>
<div class="filters">
  <select id="fVerdict"><option value="">All verdicts</option><option value="allowed">Allowed</option><option value="blocked">Blocked</option></select>
  <select id="fCountry"><option value="">All countries</option></select>
  <select id="fReason"><option value="">All reasons</option></select>
  <input id="fSearch" placeholder="Search IP / UA / ISP..." />
  <button onclick="applyFilters()">Filter</button>
  <button class="secondary" onclick="resetFilters()">Reset</button>
</div>
<div class="refresh-bar">
  <button onclick="loadLogs()">Refresh</button>
  <label class="auto-label"><input type="checkbox" id="autoRefresh" checked /> Auto-refresh (10s)</label>
  <span class="log-count" id="logCount"></span>
</div>
<div style="overflow-x:auto;">
<table>
<thead><tr>
  <th>#</th><th>Time</th><th>IP</th><th>Country</th><th>Path</th><th>Verdict</th><th>Reason</th><th>ISP / ASN</th>
</tr></thead>
<tbody id="tbody"></tbody>
</table>
</div>

<script>
const PW = ${JSON.stringify(pw)};
let allLogs = [];
let filtered = [];
let autoTimer = null;

async function loadLogs() {
  try {
    const r = await fetch('/api/shield-log?pw=' + encodeURIComponent(PW) + '&format=json');
    allLogs = await r.json();
    allLogs.reverse(); // newest first
    populateFilterOptions();
    applyFilters();
    document.getElementById('logCount').textContent = allLogs.length + ' total entries';
  } catch(e) { console.error(e); }
}

function populateFilterOptions() {
  const countries = new Set();
  const reasons = new Set();
  allLogs.forEach(l => {
    if (l.countryCode) countries.add(l.countryCode);
    if (l.reason) reasons.add(l.reason);
  });
  const fC = document.getElementById('fCountry');
  const fR = document.getElementById('fReason');
  const cVal = fC.value, rVal = fR.value;
  fC.innerHTML = '<option value="">All countries</option>';
  fR.innerHTML = '<option value="">All reasons</option>';
  [...countries].sort().forEach(c => { fC.innerHTML += '<option value="'+c+'">'+c+'</option>'; });
  [...reasons].sort().forEach(r => { fR.innerHTML += '<option value="'+r+'">'+r+'</option>'; });
  fC.value = cVal; fR.value = rVal;
}

function applyFilters() {
  const v = document.getElementById('fVerdict').value;
  const c = document.getElementById('fCountry').value;
  const r = document.getElementById('fReason').value;
  const s = document.getElementById('fSearch').value.toLowerCase();
  filtered = allLogs.filter(l => {
    if (v && l.verdict !== v) return false;
    if (c && l.countryCode !== c) return false;
    if (r && l.reason !== r) return false;
    if (s) {
      const hay = [l.ip, l.ua, l.isp, l.asn, l.reason, l.path].join(' ').toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
  renderStats();
  renderPanels();
  renderTable();
}

function resetFilters() {
  document.getElementById('fVerdict').value = '';
  document.getElementById('fCountry').value = '';
  document.getElementById('fReason').value = '';
  document.getElementById('fSearch').value = '';
  applyFilters();
}

function renderStats() {
  const total = filtered.length;
  const allowed = filtered.filter(l => l.verdict === 'allowed').length;
  const blocked = filtered.filter(l => l.verdict === 'blocked').length;
  const rate = total ? ((blocked / total) * 100).toFixed(1) : '0.0';
  document.getElementById('stats').innerHTML =
    card('Total', total, 'blue') +
    card('Allowed', allowed, 'green') +
    card('Blocked', blocked, 'red') +
    card('Block Rate', rate + '%', 'yellow');
}

function card(label, value, color) {
  return '<div class="stat-card"><div class="label">' + label + '</div><div class="value ' + color + '">' + value + '</div></div>';
}

function renderPanels() {
  const reasons = {}, countries = {};
  filtered.forEach(l => {
    if (l.reason) reasons[l.reason] = (reasons[l.reason]||0) + 1;
    if (l.countryCode) countries[l.countryCode] = (countries[l.countryCode]||0) + 1;
  });
  const sortDesc = obj => Object.entries(obj).sort((a,b) => b[1]-a[1]);
  let html = '<div class="panel"><h3>Top Block Reasons</h3>';
  sortDesc(reasons).forEach(([k,v]) => { html += '<div class="panel-row"><span>'+k+'</span><span class="cnt">'+v+'</span></div>'; });
  html += '</div><div class="panel"><h3>Top Countries</h3>';
  sortDesc(countries).forEach(([k,v]) => { html += '<div class="panel-row"><span>'+k+'</span><span class="cnt">'+v+'</span></div>'; });
  html += '</div>';
  document.getElementById('panels').innerHTML = html;
}

function renderTable() {
  const tbody = document.getElementById('tbody');
  let html = '';
  filtered.forEach((l, i) => {
    const vc = l.verdict === 'allowed' ? 'verdict-allowed' : 'verdict-blocked';
    const t = l.ts ? new Date(l.ts).toLocaleString() : '\\u2014';
    html += '<tr onclick="toggleDetail('+i+')">'
      + '<td>'+(i+1)+'</td>'
      + '<td>'+t+'</td>'
      + '<td>'+(l.ip||'\\u2014')+'</td>'
      + '<td>'+(l.countryCode||'\\u2014')+'</td>'
      + '<td>'+(l.path||'\\u2014')+'</td>'
      + '<td class="'+vc+'">'+(l.verdict||'\\u2014')+'</td>'
      + '<td>'+(l.reason||'\\u2014')+'</td>'
      + '<td>'+(l.isp||'')+(l.asn?' ('+l.asn+')':'')+'</td>'
      + '</tr>';
    html += '<tr class="detail-row" id="detail-'+i+'"><td colspan="8"><div class="detail-content">';
    html += '<div><span class="dk">User-Agent:</span></div><div class="dv">'+(l.ua||'\\u2014')+'</div>';
    html += '<div><span class="dk">Country:</span></div><div class="dv">'+(l.country||'\\u2014')+' ('+(l.countryCode||'\\u2014')+')</div>';
    html += '<div><span class="dk">ASN:</span></div><div class="dv">'+(l.asn||'\\u2014')+'</div>';
    html += '<div><span class="dk">ISP:</span></div><div class="dv">'+(l.isp||'\\u2014')+'</div>';
    if (l.checks) {
      html += '<div><span class="dk">Checks:</span></div><div class="dv">';
      Object.entries(l.checks).forEach(([k,v]) => { html += k+': '+v+'<br/>'; });
      html += '</div>';
    }
    html += '</div></td></tr>';
  });
  tbody.innerHTML = html;
}

function toggleDetail(i) {
  const el = document.getElementById('detail-'+i);
  if (el) el.classList.toggle('open');
}

function startAutoRefresh() {
  stopAutoRefresh();
  autoTimer = setInterval(loadLogs, 10000);
}
function stopAutoRefresh() {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
}
document.getElementById('autoRefresh').addEventListener('change', function() {
  if (this.checked) startAutoRefresh(); else stopAutoRefresh();
});

loadLogs();
startAutoRefresh();
</script>
</body>
</html>`;
}
