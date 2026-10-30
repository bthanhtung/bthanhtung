// Builds the profile assets: banner (light/dark) and the quote of the day.
//   node scripts/build.mjs
// The banner is a plain SVG committed to the repo, so the README never depends on third-party card services.
import fs from 'node:fs';

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

  <text x="64" y="118" font-family="${MONO}" font-size="16" letter-spacing="3" fill="${t.dim}">HELLO, WORLD — I'M</text>
  <text x="60" y="196" font-family="${SANS}" font-size="78" font-weight="800" letter-spacing="-2" fill="url(#g)">TungDaDev</text>
  <text x="64" y="240" font-family="${SANS}" font-size="21" fill="${t.text}"><tspan font-weight="700">Software Engineer</tspan> | Builder | Learner | Writer</text>
  <text x="64" y="270" font-family="${SANS}" font-size="17" fill="${t.dim}">Building financial &amp; payment systems  —  🇻🇳 Viet Nam</text>

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
fs.writeFileSync('README.md', quote(fs.readFileSync('README.md', 'utf8')));
console.log('built banner + quote');
