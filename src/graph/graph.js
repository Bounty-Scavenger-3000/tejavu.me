// Draws src/graph/graph-data.json (a graphify snapshot of this site's code) as a force graph.
// Vanilla canvas: a spring layout settles before the first paint, then only moves on interaction.
// Drag a node to move it, drag the background to pan, scroll or pinch to zoom, click to select.
// Node sizes stay constant on screen, so zooming in spreads the nodes apart.
import data from './graph-data.json';

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const header = document.querySelector('header');
const embedded = new URLSearchParams(location.search).has('embed');

const HINT = 'Tap a node to see what it touches.';
const REST = [34, 120, 150];      // link length: contains, calls, imports
const ALPHA_MIN = 0.003, DECAY = 0.992;

let AREAS, N, L, adj, anchors;
let sx = 1, sy = 1;  // draw-only stretch toward the window's shape; the physics stays round
let W = 0, H = 0, dpr = 1, scale = 1, ox = 0, oy = 0;
let alpha = 1, raf = 0, drag = null, hover = null, selected = null, areaFilter = null;
const pointers = new Map();
let gesture = null;

function rng(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function build() {
  if (embedded) document.body.classList.add('embed');
  else if (document.referrer.includes('/desk')) document.querySelector('.back').href = '/desk/';
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
  keys.forEach((k, i) => { const a = (i / keys.length) * Math.PI * 2; anchors[k] = { x: Math.cos(a) * 420, y: Math.sin(a) * 420 }; });

  const rand = rng(7);
  N = data.nodes.map((d, i) => ({ ...d, i, deg: 0, vx: 0, vy: 0, x: anchors[d.a].x + (rand() - .5) * 200, y: anchors[d.a].y + (rand() - .5) * 200 }));
  L = data.links.map(([s, t, k]) => ({ s: N[s], t: N[t], k }));
  adj = N.map(() => []);
  for (const e of L) { adj[e.s.i].push(e.t.i); adj[e.t.i].push(e.s.i); e.s.deg++; e.t.deg++; }
  for (const n of N) n.r = n.k === 'file' ? 7 : 3 + Math.min(n.deg, 12) * 0.45;

  document.getElementById('stats').textContent =
    `${N.filter(n => n.k === 'file').length} files · ${N.filter(n => n.k === 'fn').length} symbols · ${L.length} links`;
  const legend = document.getElementById('legend');
  const chips = [];
  for (const k of keys) {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = AREAS[k].label; b.style.setProperty('--c', AREAS[k].color);
    b.setAttribute('aria-pressed', 'false');
    b.onclick = () => { areaFilter = areaFilter === k ? null : k; sync(); };
    chips.push([k, b]); legend.append(b);
  }
  const reset = document.createElement('button');
  reset.className = 'chip reset'; reset.textContent = 'Reset view';
  reset.onclick = () => { selected = hover = areaFilter = null; sync(); fit(); };
  legend.append(reset);
  const sync = () => {
    chips.forEach(([k, b]) => b.setAttribute('aria-pressed', String(areaFilter === k)));
    render(); schedule();
  };
  clearAll = () => { const had = selected || areaFilter; selected = areaFilter = null; sync(); return !!had; };
}
let clearAll = () => false;

function tick(a) {
  for (let i = 0; i < N.length; i++) {
    const p = N[i];
    for (let j = i + 1; j < N.length; j++) {
      const q = N[j];
      const dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy || 0.01;
      if (d2 > 360000) continue;
      const d = Math.sqrt(d2), f = (6000 / d2) * a, fx = (dx / d) * f, fy = (dy / d) * f;
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
    n.vx += ((c.x - n.x) * 0.01 - n.x * 0.003) * a;
    n.vy += ((c.y - n.y) * 0.01 - n.y * 0.003) * a;
    n.vx *= 0.78; n.vy *= 0.78; n.x += n.vx; n.y += n.vy;
  }
}

function bounds() {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const n of N) { x0 = Math.min(x0, n.x * sx); x1 = Math.max(x1, n.x * sx); y0 = Math.min(y0, n.y * sy); y1 = Math.max(y1, n.y * sy); }
  return { x0, x1, y0, y1 };
}

function fit() {
  const padTop = header.offsetHeight + 16;
  const padBottom = W < 640 ? info.offsetHeight + 28 : 28;
  const pad = 40;
  const { x0, x1, y0, y1 } = bounds();
  scale = Math.min(1.6, (W - pad * 2) / (x1 - x0 || 1), (H - padTop - padBottom) / (y1 - y0 || 1));
  ox = W / 2 - ((x0 + x1) / 2) * scale;
  oy = padTop + (H - padTop - padBottom) / 2 - ((y0 + y1) / 2) * scale;
  schedule();
}

function resize() {
  dpr = window.devicePixelRatio || 1;
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  fit();
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
    ctx.beginPath(); ctx.moveTo(e.s.x * sx, e.s.y * sy); ctx.lineTo(e.t.x * sx, e.t.y * sy); ctx.stroke();
  }

  ctx.font = `500 ${11 * px}px "Space Grotesk", sans-serif`;
  ctx.textBaseline = 'middle';
  for (const n of N) {
    const isLit = !on || on.has(n.i), color = AREAS[n.a].color, r = n.r * px;
    ctx.globalAlpha = isLit ? 1 : 0.14;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(n.x * sx, n.y * sy, r, 0, Math.PI * 2); ctx.fill();
    if (n.k === 'file') {
      ctx.strokeStyle = color; ctx.lineWidth = 1.2 * px;
      ctx.beginPath(); ctx.arc(n.x * sx, n.y * sy, r + 3 * px, 0, Math.PI * 2); ctx.stroke();
    }
    const showLabel = n.k === 'file' || (f && isLit) || scale > 1.6;
    if (showLabel && isLit) {
      ctx.globalAlpha = n === f ? 1 : n.k === 'file' ? 0.85 : 0.7;
      ctx.fillStyle = n === f ? '#fff' : white;
      ctx.fillText(n.n, n.x * sx + r + 6 * px, n.y * sy);
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
  if (selected) add('span', 'Click it again or the background to clear.');
}

function frame() {
  raf = 0;
  if (alpha > ALPHA_MIN || drag) { tick(Math.max(alpha, drag ? 0.25 : 0)); alpha *= DECAY; raf = requestAnimationFrame(frame); }
  draw();
}
function schedule() { if (!raf) raf = requestAnimationFrame(frame); }

const world = (x, y) => ({ x: (x - ox) / scale, y: (y - oy) / scale });
function pick(e) {
  const p = world(e.clientX, e.clientY);
  for (let i = N.length - 1; i >= 0; i--) {
    const n = N[i], r = (n.r + 6) / scale;
    if ((n.x * sx - p.x) ** 2 + (n.y * sy - p.y) ** 2 <= r * r) return n;
  }
  return null;
}

function zoomAt(x, y, k) {
  const next = Math.max(0.15, Math.min(6, scale * k)), f = next / scale;
  ox = x - (x - ox) * f; oy = y - (y - oy) * f; scale = next;
  schedule();
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

canvas.addEventListener('pointerdown', e => {
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) { const [a, b] = [...pointers.values()]; gesture = { kind: 'pinch', d: dist(a, b) }; return; }
  const node = pick(e);
  gesture = { kind: node ? 'node' : 'pan', node, sx: e.clientX, sy: e.clientY, ox, oy, moved: false };
});

canvas.addEventListener('pointermove', e => {
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (!gesture) {
    const n = pick(e);
    canvas.style.cursor = n ? 'pointer' : 'default';
    if (n !== hover) { hover = n; render(); schedule(); }
    return;
  }
  if (gesture.kind === 'pinch') {
    if (pointers.size < 2) return;
    const [a, b] = [...pointers.values()], d = dist(a, b);
    zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, d / gesture.d);
    gesture.d = d;
    return;
  }
  const dx = e.clientX - gesture.sx, dy = e.clientY - gesture.sy;
  if (!gesture.moved && Math.hypot(dx, dy) < 4) return;
  gesture.moved = true;
  if (gesture.node) {
    drag = gesture.node;
    const p = world(e.clientX, e.clientY); drag.x = p.x / sx; drag.y = p.y / sy;
    alpha = Math.max(alpha, 0.3);
  } else { ox = gesture.ox + dx; oy = gesture.oy + dy; }
  schedule();
});

function release(e) {
  pointers.delete(e.pointerId);
  const g = gesture;
  if (g && g.kind !== 'pinch' && !g.moved) {
    selected = g.node && g.node !== selected ? g.node : null;
    if (!g.node) hover = null;
    render();
  }
  if (!g || g.kind === 'pinch' || pointers.size === 0) gesture = null;
  drag = null;
  schedule();
}
canvas.addEventListener('pointerup', release);
canvas.addEventListener('pointercancel', release);
canvas.addEventListener('pointerleave', () => { if (hover && !gesture) { hover = null; render(); schedule(); } });
canvas.addEventListener('wheel', e => { e.preventDefault(); zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015)); }, { passive: false });

// Esc clears a selection or filter first; with nothing left to clear, the desk's frame closes.
window.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!clearAll() && embedded) parent.postMessage('graph:close', location.origin);
});
window.addEventListener('resize', resize);

async function start() {
  try { await document.fonts.load('500 11px "Space Grotesk"'); await document.fonts.load('400 24px Universa'); } catch {}
  build();
  while (alpha > ALPHA_MIN) { tick(alpha); alpha *= DECAY; }
  // Stretch the settled layout toward the window's shape so it uses the whole screen.
  const b = bounds();
  const k = ((innerWidth - 80) / (innerHeight - header.offsetHeight - 44)) / ((b.x1 - b.x0) / (b.y1 - b.y0));
  if (k >= 1) sx = Math.min(k, 2.5); else sy = Math.min(1 / k, 2.5);
  render();
  resize();
}
start();
