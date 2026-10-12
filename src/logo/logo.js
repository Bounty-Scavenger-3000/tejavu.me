// Logo export page (tejavu.me/logo). html2canvas comes from the CDN <script> in the page head.
/*
  v1 — Dark #0D0B0E     → text #D9DEE5, gradient underline pink→teal
  v2 — Surface #141418  → text #D9DEE5, gradient underline pink→teal
  v3 — White #D9DEE5    → text #0D0B0E, gradient underline pink→teal (stays readable)
  v4 — Pink #FF7A8F     → text #0D0B0E, legs white + teal, underline: dark→teal (so it shows on pink)
  v5 — Teal #49D7E8     → text #0D0B0E, legs pink + dark, underline: pink→dark (so it shows on teal)
*/
const variants = [
  {
    id: 'v1',
    textColor: '#FFFFFF',
    divColor: 'rgba(255,255,255,0.6)',
    leftLeg: '#FF7A8F',
    rightLeg: '#49D7E8',
    gradient: 'linear-gradient(to right,#FF7A8F,#FFFFFF,#49D7E8)',
  },
  {
    id: 'v2',
    textColor: '#FFFFFF',
    divColor: 'rgba(255,255,255,0.6)',
    leftLeg: '#FF7A8F',
    rightLeg: '#49D7E8',
    gradient: 'linear-gradient(to right,#FF7A8F,#FFFFFF,#49D7E8)',
  },
  {
    id: 'v3',
    textColor: '#0D0B0E',
    divColor: 'rgba(13,11,14,0.5)',
    leftLeg: '#FF7A8F',
    rightLeg: '#49D7E8',
    gradient: 'linear-gradient(to right,#FF7A8F,#0D0B0E,#49D7E8)',
  },
  {
    id: 'v4',
    textColor: '#0D0B0E',
    divColor: 'rgba(13,11,14,0.4)',
    leftLeg: '#FFFFFF',
    rightLeg: '#49D7E8',
    gradient: 'linear-gradient(to right,#FFFFFF,#0D0B0E,#49D7E8)',
  },
  {
    id: 'v5',
    textColor: '#0D0B0E',
    divColor: 'rgba(13,11,14,0.4)',
    leftLeg: '#FF7A8F',
    rightLeg: '#FFFFFF',
    gradient: 'linear-gradient(to right,#FF7A8F,#0D0B0E,#FFFFFF)',
  },
];

function makeMark(tc, size, leftLeg, rightLeg, topColor) {
  const sw = 6;
  const h = Math.round(size * 1.2);
  const top = topColor || tc;
  return `<svg width="${size}" height="${h}" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="3" x2="77" y2="3" stroke="${top}" stroke-width="${sw}" stroke-linecap="round"/>
    <line x1="40" y1="3" x2="40" y2="48" stroke="${top}" stroke-width="${sw}" stroke-linecap="round"/>
    <line x1="40" y1="48" x2="5" y2="93" stroke="${leftLeg}" stroke-width="${sw}" stroke-linecap="round"/>
    <line x1="40" y1="48" x2="75" y2="93" stroke="${rightLeg}" stroke-width="${sw}" stroke-linecap="round"/>
  </svg>`;
}

function makeLockup(v) {
  const { textColor, topColor, divColor, leftLeg, rightLeg, gradient } = v;
  const underline = `<div style="display:block;width:100%;height:3px;border-radius:2px;background:${gradient};margin-top:5px"></div>`;
  return `
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:nowrap">
      ${makeMark(textColor, 64, leftLeg, rightLeg, topColor)}
      <div style="width:1.5px;height:44px;background:${divColor};flex-shrink:0"></div>
      <div style="display:flex;flex-direction:column;gap:0px">
        <span style="font-family:'Universa',sans-serif;font-size:26px;letter-spacing:.05em;color:${textColor};line-height:1">TEJAVU</span>
        ${underline}
        <div style="font-family:'Inter',sans-serif;font-size:9px;letter-spacing:.12em;color:${textColor};opacity:.75;margin-top:6px">THINK LESS. HAPPY MORE.</div>
      </div>
    </div>`;
}

variants.forEach(v => {
  const el = document.getElementById(v.id);
  if (el) el.innerHTML = makeLockup(v);
});

async function exportOne(id, filename) {
  setStatus('Rendering...');
  const el = document.getElementById(id);
  const canvas = await html2canvas(el, {
    scale: 4,
    backgroundColor: null,
    useCORS: true,
    logging: false,
  });
  const link = document.createElement('a');
  link.download = filename + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  setStatus(filename + '.png downloaded.');
}

async function exportAll() {
  const items = [
    ['v1', 'tejavu-logo-dark'],
    ['v2', 'tejavu-logo-surface'],
    ['v3', 'tejavu-logo-light'],
    ['v4', 'tejavu-logo-accent'],
    ['v5', 'tejavu-logo-teal'],
  ];
  for (let i = 0; i < items.length; i++) {
    setStatus(`Exporting ${i + 1} of ${items.length}...`);
    await exportOne(items[i][0], items[i][1]);
    await new Promise(r => setTimeout(r, 600));
  }
  setStatus('All 5 exported.');
}

function setStatus(msg) {
  document.getElementById('status').textContent = msg;
}

// The buttons still use inline onclick handlers, so these two stay global.
Object.assign(window, { exportOne, exportAll });
