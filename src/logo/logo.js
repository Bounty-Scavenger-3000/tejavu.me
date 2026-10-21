// Logo export page (tejavu.me/logo). html2canvas comes from the CDN <script> in the page head.
import { bindActions } from '../core/engine/actions.js';

const PINK = '#FF0099', LIGHT = '#D9DEE5', DARK = '#050408';
const modes = { tejavu: '#00F5D4', signal: '#00C244', noise: '#FFB300' };
let mode = 'tejavu';

// ink colours the crossbar, stem, wordmark and tagline; left is the left leg. The right
// leg and the last stop of the underline follow the active mode, unless the variant sets
// its own right leg. The last three sit on a mode colour: the right leg would vanish into
// it, so it turns white (the same rule the pink background applies to the left leg), and
// they do not follow the mode switch.
const variants = [
  { id: 'v1', name: 'dark',    bg: DARK,      ink: LIGHT, left: PINK,      div: 'rgba(217,222,229,0.15)' },
  { id: 'v2', name: 'surface', bg: '#0C0B12', ink: LIGHT, left: PINK,      div: 'rgba(217,222,229,0.15)' },
  { id: 'v3', name: 'light',   bg: '#FFFFFF', ink: DARK,  left: PINK,      div: 'rgba(5,4,8,0.2)' },
  { id: 'v4', name: 'accent',  bg: PINK,      ink: DARK,  left: '#FFFFFF', div: 'rgba(5,4,8,0.2)' },
  { id: 'v5', name: 'teal',    bg: modes.tejavu, ink: DARK, left: PINK, right: '#FFFFFF', div: 'rgba(5,4,8,0.2)' },
  { id: 'v6', name: 'green',   bg: modes.signal, ink: DARK, left: PINK, right: '#FFFFFF', div: 'rgba(5,4,8,0.2)' },
  { id: 'v7', name: 'amber',   bg: modes.noise,  ink: DARK, left: PINK, right: '#FFFFFF', div: 'rgba(5,4,8,0.2)' },
];

function makeMark(size, ink, left, right) {
  const line = (x1, y1, x2, y2, c) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
  return `<svg width="${size}" height="${Math.round(size * 1.2)}" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${line(3, 3, 77, 3, ink)}${line(40, 3, 40, 48, ink)}${line(40, 48, 5, 93, left)}${line(40, 48, 75, 93, right)}
  </svg>`;
}

function makeLockup({ ink, left, right = modes[mode], div }) {
  return `
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:nowrap">
      ${makeMark(64, ink, left, right)}
      <div style="width:1.5px;height:44px;background:${div};flex-shrink:0"></div>
      <div style="display:flex;flex-direction:column">
        <div style="display:flex;flex-direction:column;align-self:flex-start">
          <span style="font-family:'Universa',sans-serif;font-size:26px;letter-spacing:.05em;color:${ink};line-height:1">TEJAVU</span>
          <div style="width:100%;height:3px;border-radius:2px;background:linear-gradient(to right,${left},${ink},${right});margin-top:5px"></div>
        </div>
        <div style="font-family:'Moonrock',sans-serif;font-size:9px;letter-spacing:.1em;color:${ink};opacity:.6;margin-top:6px">THINK LESS. HAPPY MORE.</div>
      </div>
    </div>`;
}

function render() {
  variants.forEach(v => { document.getElementById(v.id).innerHTML = makeLockup(v); });
}

function setMode(m) {
  mode = m;
  document.documentElement.style.setProperty('--mode', modes[m]);
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === m));
  render();
}

const fileName = v => `tejavu-logo-${v.name}${v.right || mode === 'tejavu' ? '' : '-' + mode}`;

async function exportOne(id) {
  setStatus('Rendering...');
  const canvas = await html2canvas(document.getElementById(id), {
    scale: 4,
    backgroundColor: null,
    useCORS: true,
    logging: false,
  });
  const link = document.createElement('a');
  link.download = fileName(variants.find(v => v.id === id)) + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  setStatus(link.download + ' downloaded.');
}

async function exportAll() {
  for (let i = 0; i < variants.length; i++) {
    setStatus(`Exporting ${i + 1} of ${variants.length}...`);
    await exportOne(variants[i].id);
    await new Promise(r => setTimeout(r, 600));
  }
  setStatus(`All ${variants.length} exported.`);
}

function setStatus(msg) {
  document.getElementById('status').textContent = msg;
}

variants.forEach(v => {
  document.getElementById(v.id).style.background = v.bg;
  Object.assign(document.querySelector(`[data-export="${v.id}"]`).style, { background: v.bg, color: v.ink });
});
document.querySelectorAll('.mode-btn').forEach(b => b.style.setProperty('--c', modes[b.dataset.mode]));
setMode(mode);

bindActions({
  export: id => exportOne(id),
  'export-all': () => exportAll(),
  mode: m => setMode(m),
});
