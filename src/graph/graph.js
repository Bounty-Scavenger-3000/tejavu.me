// Draws src/graph/graph-data.json (a graphify snapshot of this site's code) as a force graph.
// Vanilla canvas: a small spring layout settles before the first paint, then only moves on interaction.
import data from './graph-data.json';

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const header = document.querySelector('header');

const HINT = 'Hover or tap a node to see what it touches.';
const REST = [26, 70, 90];       // link length: contains, calls, imports
const ALPHA_MIN = 0.003, DECAY = 0.992;

let AREAS, N, L, adj, anchors;
let W = 0, H = 0, dpr = 1, scale = 1, ox = 0, oy = 0;
let alpha = 1, raf = 0, drag = null, hover = null, selected = null, areaFilter = null;

function rng(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function build() {
  const css = getComputedStyle(document.documentElement);
  const v = name => css.getPropertyValue(name).trim();
  AREAS = {
    engine:  { label: 'Engine',     color: v('--accent') },
    panels:  { label: 'Panels',     color: v('--support') },
    desk:    { label: 'Desk scene', color: v('--text') },
    root:    { label: 'Resume',     color: '#FFB84D' },
    logo:    { label: 'Logo',       color: '#8E89A6' },
    content: { label: 'Content',    color: '#5C5873' },
  };
  const keys = Object.keys(AREAS);
  anchors = {};
  keys.forEach((k, i) => { const a = (i / keys.length) * Math.PI * 2; anchors[k] = { x: Math.cos(a) * 240, y: Math.sin(a) * 240 }; });

  const rand = rng(7);
  N = data.nodes.map((d, i) => ({ ...d, i, deg: 0, vx: 0, vy: 0, x: anchors[d.a].x + (rand() - .5) * 120, y: anchors[d.a].y + (rand() - .5) * 120 }));
  L = data.links.map(([s, t, k]) => ({ s: N[s], t: N[t], k }));
  adj = N.map(() => []);
  for (const e of L) { adj[e.s.i].push(e.t.i); adj[e.t.i].push(e.s.i); e.s.deg++; e.t.deg++; }
  for (const n of N) n.r = n.k === 'file' ? 7 : 3 + Math.min(n.deg, 12) * 0.45;

  document.getElementById('stats').textContent =
    `${N.filter(n => n.k === 'file').length} files · ${N.filter(n => n.k === 'fn').length} symbols · ${L.length} links`;
  const legend = document.getElementById('legend');
  for (const k of keys) {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = AREAS[k].label; b.style.setProperty('--c', AREAS[k].color);
    b.setAttribute('aria-pressed', 'false');
    b.onclick = () => {
      areaFilter = areaFilter === k ? null : k;
      legend.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(areaFilter !== null && c.textContent === AREAS[areaFilter].label)));
      schedule();
    };
    legend.append(b);
  }
}

function tick(a) {
  for (let i = 0; i < N.length; i++) {
    const p = N[i];
    for (let j = i + 1; j < N.length; j++) {
      const q = N[j];
      const dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy || 0.01;
      if (d2 > 90000) continue;
      const d = Math.sqrt(d2), f = (1400 / d2) * a, fx = (dx / d) * f, fy = (dy / d) * f;
      p.vx += fx; p.vy += fy; q.vx -= fx; q.vy -= fy;
    }
  }
  for (const e of L) {
    const dx = e.t.x - e.s.x, dy = e.t.y - e.s.y, d = Math.hypot(dx, dy) || 0.01;
    const f = (d - REST[e.k]) * 0.06 * a, fx = (dx / d) * f, fy = (dy / d) * f;
    e.s.vx += fx; e.s.vy += fy; e.t.vx -= fx; e.t.vy -= fy;
  }
  for (const n of N) {
    if (n === drag) { n.vx = n.vy = 0; continue; }
    const c = anchors[n.a];
    n.vx += ((c.x - n.x) * 0.012 - n.x * 0.004) * a;
    n.vy += ((c.y - n.y) * 0.012 - n.y * 0.004) * a;
    n.vx *= 0.78; n.vy *= 0.78; n.x += n.vx; n.y += n.vy;
  }
}

function fit() {
  const padTop = header.offsetHeight + 16;
  const padBottom = W < 640 ? info.offsetHeight + 28 : 28;
  const pad = 36;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const n of N) { x0 = Math.min(x0, n.x); x1 = Math.max(x1, n.x); y0 = Math.min(y0, n.y); y1 = Math.max(y1, n.y); }
  scale = Math.min(1.6, (W - pad * 2) / (x1 - x0 || 1), (H - padTop - padBottom) / (y1 - y0 || 1));
  ox = W / 2 - ((x0 + x1) / 2) * scale;
  oy = padTop + (H - padTop - padBottom) / 2 - ((y0 + y1) / 2) * scale;
}

function resize() {
  dpr = window.devicePixelRatio || 1;
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  fit(); schedule();
}

const focus = () => selected ?? hover;

function lit() {
  const f = focus();
  if (f) return new Set([f.i, ...adj[f.i]]);
  if (areaFilter) return new Set(N.filter(n => n.a === areaFilter).map(n => n.i));
  return null;
}

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
  const f = focus(), on = lit(), px = 1 / scale;
  const white = AREAS.desk.color;

  for (const e of L) {
    const hot = f && (e.s === f || e.t === f);
    const both = !on || (on.has(e.s.i) && on.has(e.t.i));
    ctx.globalAlpha = hot ? 0.95 : both ? (e.k === 0 ? 0.14 : 0.4) : 0.04;
    ctx.strokeStyle = e.k === 0 && !hot ? white : AREAS[e.s.a].color;
    ctx.lineWidth = (hot ? 1.6 : 1) * px;
    ctx.beginPath(); ctx.moveTo(e.s.x, e.s.y); ctx.lineTo(e.t.x, e.t.y); ctx.stroke();
  }

  ctx.font = `500 ${11 * px}px "Space Grotesk", sans-serif`;
  ctx.textBaseline = 'middle';
  for (const n of N) {
    const isLit = !on || on.has(n.i), color = AREAS[n.a].color;
    ctx.globalAlpha = isLit ? 1 : 0.14;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    if (n.k === 'file') {
      ctx.strokeStyle = color; ctx.lineWidth = 1.2 * px;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 3 * px, 0, Math.PI * 2); ctx.stroke();
    }
    const showLabel = n.k === 'file' || (f && isLit);
    if (showLabel && isLit) {
      ctx.globalAlpha = n === f ? 1 : n.k === 'file' ? 0.85 : 0.75;
      ctx.fillStyle = n === f ? '#fff' : white;
      ctx.fillText(n.n, n.x + n.r + 6 * px, n.y);
    }
  }
  ctx.globalAlpha = 1;
}

function render() {
  const f = focus();
  info.style.removeProperty('--c');
  if (!f) { info.textContent = HINT; return; }
  info.style.setProperty('--c', AREAS[f.a].color);
  const names = adj[f.i].map(i => N[i].n);
  info.innerHTML = '';
  const add = (tag, text) => { const el = document.createElement(tag); el.textContent = text; info.append(el); };
  add('b', f.n);
  add('span', `${f.f}${f.l ? ' · ' + f.l : ''}`);
  add('span', `${names.length} connection${names.length === 1 ? '' : 's'}`);
  if (names.length) add('em', names.slice(0, 8).join(', ') + (names.length > 8 ? `, +${names.length - 8} more` : ''));
}

function frame() {
  raf = 0;
  if (alpha > ALPHA_MIN || drag) { tick(Math.max(alpha, drag ? 0.25 : 0)); alpha *= DECAY; raf = requestAnimationFrame(frame); }
  draw();
}
function schedule() { if (!raf) raf = requestAnimationFrame(frame); }

const world = e => ({ x: (e.clientX - ox) / scale, y: (e.clientY - oy) / scale });
function pick(e) {
  const p = world(e);
  for (let i = N.length - 1; i >= 0; i--) {
    const n = N[i], r = n.r + 6 / scale;
    if ((n.x - p.x) ** 2 + (n.y - p.y) ** 2 <= r * r) return n;
  }
  return null;
}

canvas.addEventListener('pointerdown', e => {
  const n = pick(e);
  selected = n; render();
  if (n) { drag = n; canvas.setPointerCapture(e.pointerId); alpha = Math.max(alpha, 0.3); }
  schedule();
});
canvas.addEventListener('pointermove', e => {
  if (drag) { const p = world(e); drag.x = p.x; drag.y = p.y; schedule(); return; }
  const n = pick(e);
  canvas.style.cursor = n ? 'pointer' : 'default';
  if (n !== hover) { hover = n; render(); schedule(); }
});
canvas.addEventListener('pointerup', () => { drag = null; schedule(); });
canvas.addEventListener('pointerleave', () => { if (hover) { hover = null; render(); schedule(); } });
window.addEventListener('keydown', e => { if (e.key === 'Escape') { selected = null; render(); schedule(); } });
window.addEventListener('resize', resize);

async function start() {
  try { await document.fonts.load('500 11px "Space Grotesk"'); await document.fonts.load('400 24px Universa'); } catch {}
  build();
  while (alpha > ALPHA_MIN) { tick(alpha); alpha *= DECAY; }
  render();
  resize();
}
start();
