// Builds the profile assets: banner (light/dark), stats card (light/dark) and the quote of the day.
//   node scripts/build.mjs            uses GITHUB_TOKEN when set (GraphQL: contributions, streak),
//                                     otherwise falls back to the public REST API (repos, stars, languages)
// Everything is a plain SVG committed to the repo, so the README never depends on third-party card services.
import fs from 'node:fs';

const USER = 'bthanhtung';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

const THEMES = {
  dark: { bg: '#0d1117', panel: '#161b22', line: '#30363d', text: '#e6edf3', dim: '#8b949e', a: '#22d3ee', b: '#a78bfa', c: '#34d399', warn: '#f59e0b', grid: '#ffffff' },
  light: { bg: '#ffffff', panel: '#f6f8fa', line: '#d0d7de', text: '#1f2328', dim: '#59636e', a: '#0891b2', b: '#7c3aed', c: '#059669', warn: '#d97706', grid: '#000000' },
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- banner ----------
function banner(t) {
  const lines = [
    ['$', 'whoami'],
    ['', 'tungdadev // engineer · builder · learner · writer'],
    ['$', 'cat focus.txt'],
    ['', 'distributed systems · fintech · AI coding agents'],
    ['$', 'squad --plan "ship it"'],
    ['', '✓ 3 tasks · 3 workers · merged · tests green'],
  ];
  let y = 118, at = 0.6;
  const rows = lines.map(([p, s], i) => {
    const w = (s.length + (p ? 2 : 0)) * 9.1 + 4, dur = p ? Math.max(.5, s.length * .055) : .35;
    const out = `
    <clipPath id="c${i}"><rect x="642" y="${y - 16}" height="24" width="0"><animate attributeName="width" from="0" to="${w}" begin="${at}s" dur="${dur}s" fill="freeze"/></rect></clipPath>
    <text x="646" y="${y}" clip-path="url(#c${i})" font-family="${MONO}" font-size="15" fill="${p ? t.text : (i === 5 ? t.c : t.dim)}">${p ? `<tspan fill="${t.c}">${p}</tspan> ` : ''}${esc(s)}</text>`;
    at += dur + (p ? .25 : .45); y += p ? 26 : 34;
    return out;
  }).join('');
  const cy = y - 26;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="340" viewBox="0 0 1200 340" role="img" aria-label="TungDaDev — software engineer, builder, learner, writer. Building financial and payment systems. Viet Nam">
  <defs>
    <linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${t.a}"/><stop offset=".5" stop-color="${t.b}"/><stop offset="1" stop-color="${t.a}"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="-1 0;0 0;-1 0" dur="8s" repeatCount="indefinite"/></linearGradient>
    <linearGradient id="spread" x1="0" x2="1"><stop offset="0" stop-color="${t.a}" stop-opacity=".9"/><stop offset="1" stop-color="${t.b}" stop-opacity=".9"/></linearGradient>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="${t.grid}" fill-opacity=".07"/></pattern>
    <radialGradient id="glow" cx=".18" cy=".35" r=".5"><stop offset="0" stop-color="${t.b}" stop-opacity=".22"/><stop offset="1" stop-color="${t.b}" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx=".85" cy=".9" r=".45"><stop offset="0" stop-color="${t.a}" stop-opacity=".16"/><stop offset="1" stop-color="${t.a}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="340" rx="18" fill="${t.bg}"/>
  <rect width="1200" height="340" rx="18" fill="url(#dots)"/>
  <rect width="1200" height="340" rx="18" fill="url(#glow)"/>
  <rect width="1200" height="340" rx="18" fill="url(#glow2)"/>
  <rect x=".5" y=".5" width="1199" height="339" rx="18" fill="none" stroke="${t.line}"/>

  <text x="64" y="104" font-family="${MONO}" font-size="16" letter-spacing="3" fill="${t.dim}">HELLO, WORLD — I'M</text>
  <text x="60" y="182" font-family="${SANS}" font-size="78" font-weight="800" letter-spacing="-2" fill="url(#g)">TungDaDev</text>
  <text x="64" y="226" font-family="${SANS}" font-size="21" fill="${t.text}"><tspan font-weight="700">Software Engineer</tspan> | Builder | Learner | Writer</text>
  <text x="64" y="256" font-family="${SANS}" font-size="17" fill="${t.dim}">Building financial &amp; payment systems  —  🇻🇳 Viet Nam</text>
  <g font-family="${MONO}" font-size="13" fill="${t.dim}">
    <rect x="64" y="282" width="10" height="10" rx="5" fill="${t.c}"><animate attributeName="opacity" values="1;.25;1" dur="2s" repeatCount="indefinite"/></rect>
    <text x="84" y="291">co-founder @ davintek.com · writing at tungdadev.com</text>
  </g>

  <g transform="translate(0 0)">
    <rect x="620" y="50" width="530" height="262" rx="12" fill="${t.panel}" stroke="${t.line}"/>
    <path d="M620 62 a12 12 0 0 1 12 -12 h506 a12 12 0 0 1 12 12 v22 h-530 z" fill="${t.line}" fill-opacity=".45"/>
    <circle cx="642" cy="67" r="6" fill="#ff5f57"/><circle cx="662" cy="67" r="6" fill="#febc2e"/><circle cx="682" cy="67" r="6" fill="#28c840"/>
    <text x="885" y="72" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${t.dim}">~/tungdadev — zsh</text>
    ${rows}
    <rect x="646" y="${cy + 12}" width="9" height="17" fill="${t.a}" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.01;.5;.51;1" dur="1.1s" begin="${at}s" repeatCount="indefinite"/></rect>
  </g>
  <rect x="64" y="326" width="1072" height="2" rx="1" fill="url(#spread)" opacity=".5"/>
</svg>\n`;
}

// ---------- data ----------
async function gh(path) {
  const r = await fetch(`https://api.github.com${path}`, { headers: { 'User-Agent': USER, ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) } });
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}
async function data() {
  const repos = (await gh(`/users/${USER}/repos?per_page=100&type=owner`)).filter(r => !r.fork);
  const d = { repos: repos.length, stars: repos.reduce((a, r) => a + r.stargazers_count, 0), langs: {}, contrib: null };
  for (const r of repos) if (r.language) d.langs[r.language] = (d.langs[r.language] || 0) + 1;
  // Count commits straight from the history of my own repos (last 12 months). The profile contribution
  // calendar can read 0 when activity is hidden, but repo history is always public.
  const since = new Date(Date.now() - 365 * 864e5).toISOString(), days = new Map();
  let commits = 0;
  for (const r of repos) {
    for (let page = 1; page <= 10; page++) {
      let list;
      try { list = await gh(`/repos/${USER}/${r.name}/commits?author=${USER}&since=${since}&per_page=100&page=${page}`); }
      catch { break; }                                   // empty repo -> 409
      for (const c of list) {
        const day = new Date(Date.parse(c.commit.author.date) + 7 * 36e5).toISOString().slice(0, 10);   // Viet Nam time
        days.set(day, (days.get(day) || 0) + 1); commits++;
      }
      if (list.length < 100) break;
    }
  }
  const dayKey = k => new Date(Date.now() + 7 * 36e5 - k * 864e5).toISOString().slice(0, 10);
  let streak = 0;
  for (let k = days.has(dayKey(0)) ? 0 : 1; days.has(dayKey(k)); k++) streak++;   // today may still be empty
  const weeks = Array.from({ length: 53 }, (_, w) => {
    let n = 0; for (let k = 0; k < 7; k++) n += days.get(dayKey((52 - w) * 7 + 6 - k)) || 0; return n;
  });
  d.contrib = { commits, active: days.size, streak, weeks };
  return d;
}

// ---------- stats card ----------
const LANG_COLOR = { Rust: '#dea584', TypeScript: '#3178c6', JavaScript: '#f1e05a', Java: '#b07219', Go: '#00ADD8', CSS: '#663399', HTML: '#e34c26', TeX: '#3D6117', Python: '#3572A5', Shell: '#89e051' };
function stats(t, d) {
  const items = [
    ['commits · 12 mo', d.contrib ? d.contrib.commits : '—'],
    ['active days · 12 mo', d.contrib ? d.contrib.active : '—'],
    ['current streak', d.contrib ? `${d.contrib.streak}d` : '—'],
    ['public repos', d.repos],
    ['stars earned', d.stars],
  ];
  const cells = items.map(([k, v], i) => {
    const x = 36 + i * 168;
    return `<g><text x="${x}" y="78" font-family="${SANS}" font-size="34" font-weight="800" fill="${t.text}">${esc(v)}</text>
      <text x="${x}" y="102" font-family="${MONO}" font-size="12" fill="${t.dim}">${esc(k)}</text></g>`;
  }).join('');
  // weekly activity sparkline
  let spark = '';
  if (d.contrib) {
    const w = d.contrib.weeks, mx = Math.max(1, ...w), bw = 860 / w.length;
    spark = w.map((v, i) => {
      const h = Math.max(2, (v / mx) * 56);
      return `<rect x="${36 + i * bw}" y="${196 - h}" width="${Math.max(2, bw - 3)}" height="${h}" rx="2" fill="url(#bar)"/>`;
    }).join('');
    spark += `<text x="36" y="216" font-family="${MONO}" font-size="11" fill="${t.dim}">weekly activity · last 12 months</text>`;
  } else spark = `<text x="36" y="180" font-family="${MONO}" font-size="12" fill="${t.dim}">activity graph appears after the first workflow run</text>`;
  // languages
  const L = Object.entries(d.langs).sort((a, b) => b[1] - a[1]).slice(0, 5), tot = L.reduce((a, x) => a + x[1], 0) || 1;
  let lx = 36;
  const bar = L.map(([n, c]) => { const w = 860 * c / tot, r = `<rect x="${lx}" y="244" width="${w}" height="10" fill="${LANG_COLOR[n] || t.dim}"/>`; lx += w; return r; }).join('');
  let tx = 36;
  const legend = L.map(([n, c]) => { const s = `<circle cx="${tx + 5}" cy="276" r="5" fill="${LANG_COLOR[n] || t.dim}"/><text x="${tx + 16}" y="280" font-family="${MONO}" font-size="12" fill="${t.dim}">${esc(n)} ${Math.round(100 * c / tot)}%</text>`; tx += 30 + (n.length + 4) * 7.6; return s; }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="932" height="306" viewBox="0 0 932 306" role="img" aria-label="GitHub stats for ${USER}">
  <defs><linearGradient id="bar" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.a}"/><stop offset="1" stop-color="${t.b}"/></linearGradient>
  <clipPath id="lb"><rect x="36" y="244" width="860" height="10" rx="5"/></clipPath></defs>
  <rect x=".5" y=".5" width="931" height="305" rx="14" fill="${t.bg}" stroke="${t.line}"/>
  <text x="36" y="36" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${t.a}">$ git log --author=tungdadev --stat</text>
  ${cells}${spark}<g clip-path="url(#lb)">${bar}</g>${legend}
</svg>\n`;
}

// ---------- quote of the day (only rewrites between the markers) ----------
const QUOTES = [
  ['Talk is cheap. Show me the code.', 'Linus Torvalds'],
  ['Simplicity is prerequisite for reliability.', 'Edsger W. Dijkstra'],
  ['Programs must be written for people to read, and only incidentally for machines to execute.', 'Harold Abelson'],
  ['Premature optimization is the root of all evil.', 'Donald Knuth'],
  ['Make it work, make it right, make it fast.', 'Kent Beck'],
  ['Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', 'Martin Fowler'],
  ['There are only two hard things in Computer Science: cache invalidation and naming things.', 'Phil Karlton'],
  ['The best way to predict the future is to invent it.', 'Alan Kay'],
  ['Walking on water and developing software from a specification are easy if both are frozen.', 'Edward V. Berard'],
  ['Debugging is twice as hard as writing the code in the first place.', 'Brian Kernighan'],
  ['Stay hungry, stay foolish.', 'Steve Jobs'],
  ['Code is like humor. When you have to explain it, it’s bad.', 'Cory House'],
  ['Fix the cause, not the symptom.', 'Steve Maguire'],
  ['Optimism is an occupational hazard of programming: feedback is the treatment.', 'Kent Beck'],
  ['Testing shows the presence, not the absence of bugs.', 'Edsger W. Dijkstra'],
  ['Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.', 'Antoine de Saint-Exupéry'],
  ['The function of good software is to make the complex appear to be simple.', 'Grady Booch'],
  ['Before software can be reusable it first has to be usable.', 'Ralph Johnson'],
  ['Good code is its own best documentation.', 'Steve McConnell'],
  ['First, solve the problem. Then, write the code.', 'John Johnson'],
];
function quote(readme) {
  const day = Math.floor(Date.now() / 864e5), [q, a] = QUOTES[day % QUOTES.length];
  const block = `<!--QUOTE:START-->\n<p align="center"><sub><i>“${q}”</i> — ${a}</sub></p>\n<!--QUOTE:END-->`;
  return readme.replace(/<!--QUOTE:START-->[\s\S]*?<!--QUOTE:END-->/, block);
}

fs.mkdirSync('assets', { recursive: true });
for (const [k, t] of Object.entries(THEMES)) fs.writeFileSync(`assets/banner-${k}.svg`, banner(t));
const d = await data().catch(e => { console.warn('data:', e.message); return null; });
if (d) for (const [k, t] of Object.entries(THEMES)) fs.writeFileSync(`assets/stats-${k}.svg`, stats(t, d));
fs.writeFileSync('README.md', quote(fs.readFileSync('README.md', 'utf8')));
console.log('built', d ? `(${d.contrib.commits} commits, ${d.contrib.active} active days)` : '(no data)');
