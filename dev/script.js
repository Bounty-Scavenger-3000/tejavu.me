/* ═══════════════════════════════════════════════
   TEJAS PORTFOLIO — script.js
   All interactive behaviour for the site.
   See docs/architecture.md for function-level documentation.
   See docs/element-registry.md for SEC-XX ID references.

   Function index:
     updateClock()           — keeps #osTime current [SEC-03-E07]
     bootSequence()          — triggered by monitor click [SEC-00]
     skipBoot()              — skip button on boot screen [SEC-00]
     finishBoot()            — called after boot completes [SEC-00]
     openPanel(id)           — show a panel full-screen [COMP-01]
     closePanel(id)          — hide a panel, restore room [COMP-01]
     switchPanel(from, to)   — close one panel, open another [SEC-10-E03]
     drawBigStrings(hl)      — SVG connection lines on expanded board [SEC-12]
     drawSceneStrings()      — SVG connection lines on scene board [SEC-04]
     highlightConnections(id)— highlight a note's connections [SEC-12]
     openNoteDetail(key)     — show full note overlay [SEC-12-E02]
     closeNoteDetail()       — hide note overlay [SEC-12-E02]
   ═══════════════════════════════════════════════ */

'use strict';

// ── init ──
const _cd = document.getElementById('chequeDate');
if(_cd) _cd.textContent =
  new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});

function updateClock(){
  const t = document.getElementById('osTime');
  if(t) t.textContent = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
}
updateClock();
setInterval(updateClock,10000);

// ─────────────────────────────────────────────
// [SEC-00] BOOT SEQUENCE
// Terminal-text BIOS simulation shown when the
// monitor is clicked. Colour classes:
//   ''   = green (default)
//   'd'  = dim green
//   'am' = amber
//   'er' = red  ← [SEC-00-EGG01] ALERT line is red
// ─────────────────────────────────────────────
const bootMessages = [
  {t:'TEJAS-PC BIOS v2.0                    Award Modular BIOS v4.51PG',c:''},
  {t:'Copyright (c) 2026 Tejas Industries. All Rights Reserved.',c:'d'},
  {t:'',c:''},
  {t:'Intel(R) Pentium(R) III  693 MHz',c:''},
  {t:'Memory Test:  655360K OK',c:'d'},
  {t:'',c:''},
  {t:'Detecting Primary Master ... SKILLS.DAT        [LOADED]',c:''},
  {t:'Detecting Primary Slave  ... PROJECTS.LOG      [4 ENTRIES]',c:''},
  {t:'Detecting Secondary      ... COMPETITIONS.ISO  [3 FINALS, 0 WINS]',c:'am'},
  {t:'',c:''},
  {t:'Loading ACCA_PAPERS.EXE ... 9 done, 4 to go (SBL SBR APM AAA).',c:''},
  {t:'Loading RTI_TRACKER.EXE ... 20,000 volunteers indexed.',c:''},
  {t:'',c:''},
  {t:'ALERT: Subject funnier in meetings than strictly professional.',c:'er'}, // [SEC-00-EGG01]
  {t:'',c:''},
  {t:'Starting TEJAS-OS 98...',c:''},
];

let booted = false;

function skipBoot(){
  const bs = document.getElementById('boot-screen');
  const bar = document.getElementById('bootBar');
  const statusL = document.getElementById('bootStatusL');
  const statusR = document.getElementById('bootStatusR');
  if(bar) bar.style.width = '100%';
  if(statusL) statusL.textContent = 'Boot complete.';
  if(statusR) statusR.textContent = '100%';
  if(bs) bs.classList.remove('active');
  finishBoot();
}

function bootSequence(){
  if(booted){ openPanel('os'); return; }
  const bs    = document.getElementById('boot-screen');
  const lines = document.getElementById('bootLines');
  const bar   = document.getElementById('bootBar');
  lines.innerHTML = '';
  bar.style.width = '0%';
  bs.classList.add('active');
  document.getElementById('room').style.opacity = '0';

  const statusL = document.getElementById('bootStatusL');
  const statusR = document.getElementById('bootStatusR');
  const statusPhrases = ['POST check...','Memory test...','Loading drivers...','Detecting hardware...','Reading boot sector...','Starting OS...'];

  let i = 0;
  function next(){
    if(i >= bootMessages.length){
      if(statusL) statusL.textContent = 'Boot complete.';
      if(statusR) statusR.textContent = '100%';
      setTimeout(()=>{ bs.classList.remove('active'); finishBoot(); }, 700);
      return;
    }
    const m = bootMessages[i];
    const d = document.createElement('div');
    d.className = 'boot-line' + (m.c ? ' '+m.c : '');
    d.textContent = m.t || '\u00A0';
    lines.appendChild(d);
    requestAnimationFrame(()=> d.classList.add('show'));
    lines.scrollTop = lines.scrollHeight;
    const pct = Math.round((i+1)/bootMessages.length*100);
    bar.style.width = pct+'%';
    if(statusL) statusL.textContent = statusPhrases[Math.floor(i/bootMessages.length*statusPhrases.length)] || 'Loading...';
    if(statusR) statusR.textContent = pct+'%';
    i++;
    setTimeout(next, m.t === '' ? 60 : 110 + Math.random()*70);
  }
  next();
}

function finishBoot(){
  booted = true;
  document.getElementById('monIdle').style.display = 'none';
  document.getElementById('monOS').style.display   = 'block';
  document.getElementById('room').style.opacity    = '1';
  // [DEC-NEW] Don't auto-open any panel — let user click an icon from the OS grid
}

// ─────────────────────────────────────────────
// [COMP-01] PANEL SYSTEM
// Single API for all full-screen overlays.
//
// CRITICAL — CSS specificity trap (DEC-011):
// .panel { position: fixed } is the base rule.
// Never add position:relative to a panel-specific
// CSS class — it overrides position:fixed at equal
// specificity, making the panel invisible because
// body { overflow: hidden }.
// ─────────────────────────────────────────────
const PANELS = ['os','ledger','audit','dossier','contact','board'];

function openPanel(id){
  const el = document.getElementById('panel-'+id);
  if(!el) return;
  document.getElementById('room').style.opacity = '0';
  el.style.display = 'block';
  requestAnimationFrame(()=> el.classList.add('active'));
  // Board needs its SVG strings drawn after the panel is visible
  if(id === 'board'){
    setTimeout(()=> drawBigStrings(null), 350);
  }
}

function closePanel(id){
  const el = document.getElementById('panel-'+id);
  if(!el) return;
  el.classList.remove('active');
  setTimeout(()=>{
    el.style.display = 'none';
    const anyOpen = PANELS.some(p => {
      const pe = document.getElementById('panel-'+p);
      return pe && pe.classList.contains('active');
    });
    if(!anyOpen) document.getElementById('room').style.opacity = '1';
  }, 320);
}

// [SEC-10-E03] Used by the dossier's cross-panel jump links
function switchPanel(fromId, toId){
  closePanel(fromId);
  setTimeout(()=> openPanel(toId), 340);
}

// ESC — closes note detail first, then panels, then boot screen
document.addEventListener('keydown', e => {
  if(e.key !== 'Escape') return;
  const nd = document.getElementById('noteDetail');
  if(nd && nd.classList.contains('active')){ closeNoteDetail(); return; }
  PANELS.forEach(id => {
    const el = document.getElementById('panel-'+id);
    if(el && el.classList.contains('active')) closePanel(id);
  });
  const bs = document.getElementById('boot-screen');
  if(bs && bs.classList.contains('active')) skipBoot();
});

// ─────────────────────────────────────────────
// [SEC-11-E01] CHEQUE FORM
// ─────────────────────────────────────────────
const _cf = document.getElementById('chequeForm');
if(_cf) _cf.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('chequeForm').style.display = 'none';
  document.getElementById('chequeOK').style.display   = 'block';
});

// ─────────────────────────────────────────────
// [SEC-12] BOARD STRING SYSTEM
// SVG lines drawn via getBoundingClientRect() after
// DOM layout, so positions are always accurate.
//
// To add a connection: add the key pair to the
// connections object below (both directions are
// deduplicated — only list each pair once).
// Then add a matching #bn-<key> pin-note element
// in index.html inside #bigBoard.
// ─────────────────────────────────────────────
const connections = {
  humshakals: ['dean','verdict','record'],
  dean:       ['humshakals'],
  verdict:    ['humshakals','prachaara'],
  prachaara:  ['verdict','record'],
  crescere:   ['record'],
  civic:      ['broseph'],
  record:     ['humshakals','prachaara','crescere','broseph'],
  broseph:    ['civic','record'],
  newsletter: ['broseph'],
};

function drawBigStrings(highlighted){
  const svg = document.getElementById('bigStrings');
  if(!svg) return;
  svg.innerHTML = '';
  const board = document.getElementById('bigBoard');
  if(!board) return;
  const br    = board.getBoundingClientRect();
  const drawn = new Set();
  Object.entries(connections).forEach(([a, targets])=>{
    targets.forEach(b => {
      const key = [a,b].sort().join('|');
      if(drawn.has(key)) return;
      drawn.add(key);
      const na = document.getElementById('bn-'+a);
      const nb = document.getElementById('bn-'+b);
      if(!na || !nb) return;
      const ra = na.getBoundingClientRect();
      const rb = nb.getBoundingClientRect();
      const x1 = ra.left - br.left + ra.width/2;
      const y1 = ra.top  - br.top  + ra.height/2;
      const x2 = rb.left - br.left + rb.width/2;
      const y2 = rb.top  - br.top  + rb.height/2;
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',x1); line.setAttribute('y1',y1);
      line.setAttribute('x2',x2); line.setAttribute('y2',y2);
      const isHl = highlighted && (a===highlighted || b===highlighted);
      line.setAttribute('stroke',       isHl ? '#ff3333' : 'rgba(180,60,60,.35)');
      line.setAttribute('stroke-width', isHl ? '2'       : '1');
      line.setAttribute('stroke-dasharray', isHl ? '0'   : '4 3');
      svg.appendChild(line);
    });
  });
}

// Small scene board — simplified hub-and-spoke [SEC-04-E01]
function drawSceneStrings(){
  const svg = document.getElementById('sceneStrings');
  if(!svg) return;
  svg.innerHTML = '';
  const board = document.querySelector('.board-cork');
  if(!board) return;
  const br = board.getBoundingClientRect();
  const sceneConnections = [
    ['sn-humshakals','sn-dean'],
    ['sn-humshakals','sn-record'],
    ['sn-prachaara', 'sn-record'],
    ['sn-crescere',  'sn-record'],
    ['sn-civic',     'sn-record'],
    ['sn-newsletter','sn-record'],
  ];
  sceneConnections.forEach(([a,b])=>{
    const na = document.getElementById(a);
    const nb = document.getElementById(b);
    if(!na||!nb) return;
    const ra = na.getBoundingClientRect();
    const rb = nb.getBoundingClientRect();
    const x1 = ra.left - br.left + ra.width/2;
    const y1 = ra.top  - br.top  + ra.height/2;
    const x2 = rb.left - br.left + rb.width/2;
    const y2 = rb.top  - br.top  + rb.height/2;
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',x1); line.setAttribute('y1',y1);
    line.setAttribute('x2',x2); line.setAttribute('y2',y2);
    line.setAttribute('stroke',           'rgba(200,60,60,.5)');
    line.setAttribute('stroke-width',     '1');
    line.setAttribute('stroke-dasharray', '3 2');
    svg.appendChild(line);
  });
}

function highlightConnections(id){
  drawBigStrings(id);
  const el = document.getElementById('bn-'+id);
  if(el){
    el.style.transition = 'transform .2s';
    el.style.transform  = 'scale(1.05)';
    setTimeout(()=>{ el.style.transform = ''; }, 400);
  }
}

// ─────────────────────────────────────────────
// [SEC-12-E02] NOTE DETAIL SYSTEM
// Full text for each board note. Opening a note
// also highlights its connection strings.
//
// To add a note: add a key here with meta/title/body,
// add its #bn-<key> element in index.html, and add
// its connections to the connections object above.
// ─────────────────────────────────────────────
const noteDetails = {
  humshakals: {
    meta:  'Christ University · Feb 2026',
    title: 'Humshakals — Prachaara 2.0',
    body:  "Solo pitch round, Prachaara 2.0's flagship comedy-pitch event. Organisers assign a random character and product category — mine was Pushpa, marketing vehicle cleaning products. Instead of a straight pitch, I ran a standup set that only nodded at the brief: a full product line called Thaggede Le — a cleaning brush, truck polish, an interior cleaner branded as \u2018enemy\u2019s blood,\u2019 and an air freshener called Sheshachalam Mist. Ran twelve minutes over the time limit in front of 300+ students and faculty.",
  },
  dean: {
    meta:  'Same set, mid-bit',
    title: 'The Callback',
    body:  "Midway through a bit about the red liquid, someone in the crowd shouted a guess. I fired back a line without knowing it was the associate dean \u2014 the room lost it once people realised who I\u2019d just clapped back at.",
  },
  verdict: {
    meta:  'Humshakals \u00b7 judges\u2019 feedback',
    title: 'The Verdict',
    body:  "Asked the crowd if they wanted the product. Every hand went up. It didn\u2019t place \u2014 judges said the product had zero commercial value. I don\u2019t do it to win; people remember energy over slides.",
  },
  prachaara: {
    meta:  'Christ University · Dec 2024',
    title: 'Prachaara: Marketing Ka Punchnama',
    body:  "The department's flagship marketing event. First round: judges and other participants, got through on humor and people skills alone. Finals: 200+ people, the whole department. Assigned character: Jackie Chan from Rush Hour, marketing a beauty product. Built a makeup kit sourced from Thailand, China, and Vietnam, then barely stayed in character. The deck was AI-generated images and AI-generated financial projections, thrown together in about ten minutes \u2014 admitted that on stage, then closed with a dance and confetti. Didn\u2019t win. Judges said I\u2019d have taken it if I hadn\u2019t admitted the financials were AI-generated.",
  },
  crescere: {
    meta:  'Finance & Leadership Cell, Christ University',
    title: 'CRESCERE',
    body:  "Not a member of the Finance & Leadership Cell, but they brought me in to market CRESCERE anyway. Three of us dressed as Squid Game guards, ran the show's paper-flipping game in the middle of campus, and pulled people over to the registration stall. Also competed: my team drew a failing company in Round 1, built a recovery plan, defended it through judge Q&A. Won the round, reached the finals.",
  },
  civic: {
    meta:  'Christ University \u00d7 Broseph Foundation · Sep 2025',
    title: 'University-NGO Civic Drive',
    body:  "Organised this collaboration from the Foundation's side, with a friend who headed the university's SDG club organising it from theirs. Co-led one of two field teams on the day. Across both teams: 20+ participants, 10+ bags of garbage collected, 60+ civic issues logged on the BBMP Sahaya app.",
  },
  broseph: {
    meta:  'Throughline',
    title: 'Same Skill, Different Room',
    body:  "Reading a room and adjusting on the fly is the same skill whether it's 20,000 volunteers or 300 strangers laughing at a joke about truck polish. Different registers, same instinct.",
  },
  record: {
    meta:  'Track record',
    title: '0-for-3',
    body:  "Reached the finals in three separate business-pitch and case competitions. Won zero. Genuinely doesn't mind \u2014 people remember energy over slides, and being memorable beats a trophy that gets forgotten in a year.",
  },
  newsletter: {
    meta:  'Beehiiv',
    title: 'Newsletter',
    body:  "The unfiltered version of all of this \u2014 the stuff that doesn't fit neatly into a portfolio panel \u2014 lives on the newsletter. Sign up on Beehiiv.",
  },
};

function openNoteDetail(key){
  const d = noteDetails[key];
  if(!d) return;
  document.getElementById('ndMeta').textContent  = d.meta;
  document.getElementById('ndTitle').textContent = d.title;
  document.getElementById('ndBody').textContent  = d.body;
  document.getElementById('noteDetail').classList.add('active');
  highlightConnections(key);
}

function closeNoteDetail(){
  document.getElementById('noteDetail').classList.remove('active');
}

// ─────────────────────────────────────────────
// INIT — draw scene strings on load and resize
// ─────────────────────────────────────────────
window.addEventListener('load',   ()=>{ setTimeout(drawSceneStrings, 300); });
window.addEventListener('resize', drawSceneStrings);
