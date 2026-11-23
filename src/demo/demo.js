// Demo page (tejavu.me/demo): new features go up here first, then merge into the real pages.
// html2canvas comes from the CDN <script> in the page head.

const PINK = '#FF0099', LIGHT = '#D9DEE5', DARK = '#050408';
const MODES = { tejavu: '#00F5D4', signal: '#00C244', noise: '#FFB300' };
const $ = s => document.querySelector(s);
const cap = s => s[0].toUpperCase() + s.slice(1);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The Tejavu mark: crossbar and stem in ink, the two legs in their own colours.
const mark = (w, ink, left, right) =>
  `<svg width="${w}" height="${Math.round(w * 1.2)}" viewBox="0 0 80 96" fill="none" stroke-width="6" stroke-linecap="round">` +
  `<path d="M3 3H77M40 3V48" stroke="${ink}"/><path d="M40 48L5 93" stroke="${left}"/><path d="M40 48L75 93" stroke="${right}"/></svg>`;

async function savePng(el, name, status) {
  status.textContent = 'Rendering...';
  try {
    const canvas = await html2canvas(el, { scale: 4, backgroundColor: null, useCORS: true, logging: false });
    const a = Object.assign(document.createElement('a'), { download: name + '.png', href: canvas.toDataURL('image/png') });
    a.click();
    status.textContent = `${a.download} downloaded.`;
  } catch {
    status.textContent = 'Export failed.';
  }
}

/* ── Profile card ── */
const CARD0 = {
  name: 'TEJAS MP',
  role: 'Community builder, finance person',
  tagline: true,
  rows: [['Website', 'tejavu.me'], ['LinkedIn', 'in/accatejas'], ['Instagram', '@tejavu.mp4']].map(([label, value]) => ({ on: true, label, value })),
};
let card = structuredClone(CARD0);

function drawCard() {
  $('#card').innerHTML = `
    <div class="pc-head"><div class="pc-id"><div class="pc-name">${esc(card.name)}</div><i class="pc-ul"></i></div>${mark(26, LIGHT, PINK, MODES.tejavu)}</div>
    <div class="pc-role">${esc(card.role)}</div>
    <div class="pc-art">${mark(112, LIGHT, PINK, MODES.tejavu)}</div>
    <ul class="pc-rows">${card.rows.filter(r => r.on).map(r => `<li><b>${esc(r.label)}</b><span>${esc(r.value)}</span></li>`).join('')}</ul>
    ${card.tagline ? '<div class="pc-tag">THINK LESS. HAPPY MORE.</div>' : ''}`;
}

// The form is drawn again only when rows are added or removed, so typing never loses focus.
function drawForm() {
  $('#card-form').innerHTML = `
    <label class="fld">Name<input data-f="name" value="${esc(card.name)}"></label>
    <label class="fld">Role line<input data-f="role" value="${esc(card.role)}"></label>
    <label class="chk"><input type="checkbox" data-f="tagline"${card.tagline ? ' checked' : ''}>Tagline</label>
    <div class="rows">${card.rows.map((r, i) => `
      <div class="row" data-i="${i}">
        <input type="checkbox" data-r="on" aria-label="Show row"${r.on ? ' checked' : ''}>
        <input data-r="label" aria-label="Label" value="${esc(r.label)}">
        <input data-r="value" aria-label="Value" value="${esc(r.value)}">
        <button class="x" data-act="del" aria-label="Remove row">×</button>
      </div>`).join('')}</div>
    <button class="btn" data-act="add">+ Add row</button>`;
}

$('#card-form').addEventListener('input', e => {
  const t = e.target, row = t.closest('.row'), v = t.type === 'checkbox' ? t.checked : t.value;
  if (row) card.rows[row.dataset.i][t.dataset.r] = v; else card[t.dataset.f] = v;
  drawCard();
});
$('#card-form').addEventListener('click', e => {
  const act = e.target.dataset.act;
  if (act === 'del') card.rows.splice(e.target.closest('.row').dataset.i, 1);
  else if (act === 'add') card.rows.push({ on: true, label: 'Label', value: 'Value' });
  else return;
  drawForm();
  drawCard();
});
$('#card-export').addEventListener('click', () => savePng($('#card'), 'tejavu-card', $('#card-status')));
$('#card-reset').addEventListener('click', () => { card = structuredClone(CARD0); drawForm(); drawCard(); });

/* ── Logo studio ── */
// ink colours the crossbar, stem, wordmark and tagline. The right leg and the last stop of the
// underline follow the mode, unless the background sets its own right leg: on teal, green and
// amber the mode colour would vanish, so the leg turns white.
const BGS = {
  dark:       { label: 'Dark',             bg: DARK,         ink: LIGHT, left: PINK },
  surface:    { label: 'Surface',          bg: '#0C0B12',    ink: LIGHT, left: PINK },
  white:      { label: 'White',            bg: '#FFFFFF',    ink: DARK,  left: PINK },
  pink:       { label: 'Pink',             bg: PINK,         ink: DARK,  left: '#FFFFFF' },
  teal:       { label: 'Teal',             bg: MODES.tejavu, ink: DARK,  left: PINK, right: '#FFFFFF' },
  green:      { label: 'Green',            bg: MODES.signal, ink: DARK,  left: PINK, right: '#FFFFFF' },
  amber:      { label: 'Amber',            bg: MODES.noise,  ink: DARK,  left: PINK, right: '#FFFFFF' },
  clearlight: { label: 'Clear, light ink', bg: 'transparent', ink: LIGHT, left: PINK },
  cleardark:  { label: 'Clear, dark ink',  bg: 'transparent', ink: DARK,  left: PINK },
};
// [width, height, corner radius] in px at 1x (exports are 4x), and how much of the stage the lockup may fill.
// On the wide stage the full lockup fills .51, the size the logo page exports; fewer parts get .64.
const SHAPES = { wide: [442, 180, 14, .51], square: [320, 320, 14, .6], rounded: [320, 320, 72, .6], circle: [320, 320, 160, .5] };
const PARTS = { symbol: 'Symbol', name: 'Name', tagline: 'Tagline', underline: 'Underline' };
const ST0 = { parts: { symbol: true, name: true, tagline: true, underline: true }, bg: 'dark', mode: 'tejavu', shape: 'wide' };
let st = structuredClone(ST0);

function stName() {
  const keys = Object.keys(st.parts).filter(k => st.parts[k]);
  const parts = keys.length === 4 ? 'logo' : keys.join('-');
  const mode = BGS[st.bg].right || st.mode === 'tejavu' ? '' : '-' + st.mode;
  return `tejavu-${parts}-${st.bg}${mode}-${st.shape}`;
}

function drawStudio() {
  const { parts: p, shape } = st, b = BGS[st.bg], [W, H, radius, fullFill] = SHAPES[shape];
  const fill = shape === 'wide' && !Object.values(p).every(Boolean) ? .64 : fullFill;
  const right = b.right || MODES[st.mode], stack = shape !== 'wide';
  const dv = b.ink === DARK ? 'rgba(5,4,8,0.2)' : 'rgba(217,222,229,0.15)';
  const nm = p.name || p.underline
    ? `<div class="lk-nm${p.name ? '' : ' solo'}">${p.name ? '<span class="lk-name">TEJAVU</span>' : ''}${p.underline ? '<i class="lk-ul"></i>' : ''}</div>` : '';
  const tg = p.tagline ? '<div class="lk-tg">THINK LESS. HAPPY MORE.</div>' : '';
  const tx = nm || tg ? `<div class="lk-tx">${nm}${tg}</div>` : '';
  const stage = $('#st-stage');
  stage.style.cssText = `width:${W}px;height:${H}px;border-radius:${radius}px;background:${b.bg};--ink:${b.ink};--left:${b.left};--right:${right};--dv:${dv}`;
  stage.innerHTML = `<div class="lk${stack ? ' stack' : ''}">${p.symbol ? `<span class="lk-mark">${mark(64, b.ink, b.left, right)}</span>` : ''}${p.symbol && tx && !stack ? '<i class="lk-dv"></i>' : ''}${tx}</div>`;
  // Everything inside is in em: measure at 16px, then scale the font size so the lockup fits the shape.
  const lk = stage.firstElementChild;
  lk.style.fontSize = '16px';
  lk.style.fontSize = 16 * Math.min(W * fill / lk.offsetWidth, H * fill / lk.offsetHeight) + 'px';

  document.querySelectorAll('#st-ctl .chip').forEach(c => {
    const { g, v } = c.dataset;
    c.setAttribute('aria-pressed', g === 'parts' ? st.parts[v] : st[g] === v);
    if (g === 'mode') c.disabled = !!b.right;
  });
  $('#st-hint').hidden = !b.right;
  $('#st-pv').classList.toggle('chk', b.bg === 'transparent');
  $('#st-file').textContent = `${stName()}.png · ${W * 4} x ${H * 4}`;
}

const chip = (g, v, label, attrs = '') => `<button class="chip" data-g="${g}" data-v="${v}"${attrs}>${label}</button>`;
const dot = b => b.bg === 'transparent' ? '<i class="dot clear"></i>' : `<i class="dot" style="background:${b.bg}"></i>`;
function buildChips() {
  $('#st-parts').innerHTML = Object.entries(PARTS).map(([k, l]) => chip('parts', k, l)).join('');
  $('#st-bg').innerHTML = Object.entries(BGS).map(([k, b]) => chip('bg', k, dot(b) + b.label)).join('');
  $('#st-mode').innerHTML = Object.entries(MODES).map(([k, c]) => chip('mode', k, cap(k), ` style="--c:${c}"`)).join('');
  $('#st-shape').innerHTML = Object.keys(SHAPES).map(k => chip('shape', k, cap(k))).join('');
}

$('#st-ctl').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c || c.disabled) return;
  const { g, v } = c.dataset;
  if (g === 'parts') {
    if (st.parts[v] && Object.values(st.parts).filter(Boolean).length === 1) return; // one part always stays on
    st.parts[v] = !st.parts[v];
  } else st[g] = v;
  drawStudio();
});
$('#st-export').addEventListener('click', () => savePng($('#st-stage'), stName(), $('#st-status')));
$('#st-reset').addEventListener('click', () => { st = structuredClone(ST0); drawStudio(); });

// The lockup is measured, so draw once the fonts are in.
await Promise.all(['16px Universa', '16px Moonrock', '16px "Space Grotesk"'].map(f => document.fonts.load(f)));
drawCard();
drawForm();
buildChips();
drawStudio();
